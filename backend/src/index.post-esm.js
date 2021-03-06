// @see https://github.com/elad/node-cluster-socket.io

import cluster from 'cluster';
import express from 'express';
import { HTTP_LISTEN_PORT } from './config';
import initClusterWorkerAPIServer from './initClusterWorkerAPIServer';
import net from 'net';
import farmhash from 'farmhash';
import sio from 'socket.io';
import sioRedis from 'socket.io-redis';
import { cpus } from 'os';

const port = HTTP_LISTEN_PORT;
const lenCPUs = cpus().length;

const { BACKEND_REDIS_HOST, BACKEND_REDIS_PORT } = process.env;

if (cluster.isMaster) {
  // This stores our workers. We need to keep them to be able to reference
  // them based on source IP address. It's also useful for auto-restart,
  // for example.
  const workers = [];

  // Helper function for spawning worker at index 'i'
  let spawn = function (i) {
    workers[i] = cluster.fork();

    // Optional: Restart worker on exit
    workers[i].on('exit', () => {
      console.log('respawning worker', i);
      spawn(i);
    });
  };

  // Spawn workers
  for (let i = 0; i < lenCPUs; i++) {
    spawn(i);
  }

  // Helper function for getting a worker index based on IP address.
  // This is a hot path so it should be really fast. The way it works
  // is by converting the IP address to a number by removing non numeric
  // characters, then compressing it to the number of slots we have.
  //
  // Compared against "real" hashing (from the sticky-session code) and
  // "real" IP number conversion, this function is on par in terms of
  // worker index distribution only much faster.
  let worker_index = function (ip, len) {
    return farmhash.fingerprint32(ip) % len; // Farmhash is the fastest and
    // works with IPv6, too
  };

  // Create the outside facing server listening on our port
  net.createServer({ pauseOnConnect: true }, function (connection) {
    // We received a connection and need to pass it to the appropriate
    // worker. Get the worker for this connection's source IP and pass
    // it the connection.
    let worker = workers[worker_index(connection.remoteAddress, lenCPUs)];
    worker.send('sticky-session:connection', connection);
  }).listen(port);
} else {
  // Worker thread

  // This must be included at the beginning of the stack in order to properly
  // detect the Node.js uptime
  require('utils/node/nodeUptime');

  // Note we don't use a port here because the master listens on it for us
  const app = new express();

  // Don't expose our internal server to the outside
  const server = app.listen(0, 'localhost');
  const io = sio(server);

  // Tell Socket.IO to use the redis adapter. By default, the redis
  // server is assumed to be on localhost:6379. You don't have to
  // specify them explicitly unless you want to change them.
  io.adapter(sioRedis({
    host: BACKEND_REDIS_HOST,
    port: BACKEND_REDIS_PORT
  }));

  // Listen to messages sent from the master. Ignore everything else.
  process.on('message', function (message, connection) {
    if (message !== 'sticky-session:connection') {
      return;
    }

    // Emulate a connection event on the server by emitting the
    // event with the connection the master sent us.
    server.emit('connection', connection);

    connection.resume();
  });

  // TODO: Handle this better
  // @see https://medium.com/dailyjs/how-to-prevent-your-node-js-process-from-crashing-5d40247b8ab2
  // @see https://medium.com/@trekinbami/using-environment-variables-in-react-6b0a99d83cf5
  process.on('unhandledRejection', (reason/*, promise*/) => {
    console.error('Unhandled Rejection at:', reason.stack || reason);
    // or whatever crash reporting service you use
  });

  initClusterWorkerAPIServer(app, io);
}