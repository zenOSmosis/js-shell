// @see https://github.com/zertosh/v8-compile-cache#readme
// @see [further reading] https://medium.com/@felixrieseberg/javascript-on-the-desktop-fast-and-slow-2b744dfb8b55
require('v8-compile-cache');

const cluster = require('cluster');
const workers = [];
const cpus = require('os').cpus().length;
const { HTTP_LISTEN_PORT } = require('./config');
// const clients = {};
const net = require('net');
const farmhash = require('farmhash');
const express = require('express');
// const redis = require('socket.io-redis'); 
// const socketio = require('socket.io');
// const path = require('path');
const memored = require('memored');
// const circularjson = require('circular-json');

if(cluster.isMaster){
    console.log('Master started process id', process.pid);

    for(let i=0;i<cpus;i++){
        workers.push( cluster.fork());
        console.log('worker strated '+workers[i].id);

        workers[i].on('disconnect',() => {
            console.log('worker '+ workers[i].id+'died');
        });

        // handling process.send message events in master
        workers[i].on('message',(msg) => {
          if(msg.cmd==='newMessage'){
              console.log("master is notified about new message by worker",workers[i].id);
              sendNewmessage(msg);
          }
        })
    }

    // notifying all workers about new client
    sendNewmessage = (msg) => {
        workers[msg.workerID-1].send({
           ...msg 
        })
    }

    // get worker index based on Ip and total no of workers so that it can be tranferred to same worker
    const getWorker_index = (ip,len) => {
        return farmhash.fingerprint32(ip)%len;
    }

    // ceating TCP server
    const server = net.createServer({
        // seting pauseOnCOnnect to true , so that when  we receive a connection pause it
        // and send to corresponding worker
        pauseOnConnect: true 
    }, (connection) => {
        // We received a connection and need to pass it to the appropriate
		    // worker. Get the worker for this connection's source IP and pass
        // it the connection. we use above defined getworker_index func for that
        const worker = workers[getWorker_index(connection.remoteAddress,cpus)];

        // send the connection to the worker and send resume it there using .resume()
        worker.send({
            cmd:'sticky-session'
        },connection);
    }).listen(HTTP_LISTEN_PORT);


    process.on('SIGINT',() => {
        console.log('cleaning up master server...');
        server.close();
        memored.clean(() => {
            onsole.log('cleaned memory..');
        })
        process.exit(1);
    });

} else {
// Enable module aliases
// @see https://www.npmjs.com/package/module-alias
require('module-alias/register');

  const expressServer = require('./servers/expressServer');

  expressServer.start();


// TODO: Handle this better
// @see https://medium.com/dailyjs/how-to-prevent-your-node-js-process-from-crashing-5d40247b8ab2
// @see https://medium.com/@trekinbami/using-environment-variables-in-react-6b0a99d83cf5
process.on('unhandledRejection', (reason/*, promise*/) => {
  console.error('Unhandled Rejection at:', reason.stack || reason);
  // or whatever crash reporting service you use
});
}