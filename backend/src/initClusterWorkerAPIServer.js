import express from 'express';
import session from 'express-session';
import httpProxy from 'http-proxy';
import requestIp from 'request-ip';
import expressAPIRoutes from './api/express/routes';
import { initSocketAPIRoutes } from './api/socket.io/routes';
import { SOCKET_API_EVT_PEER_CONNECT, SOCKET_API_EVT_PEER_DISCONNECT } from './api/socket.io/events';
import {
  EXPRESS_CUSTOM_RESPONSE_HEADERS,
  PATH_PUBLIC,
  FRONTEND_PROXY_URL,
  HTTP_LISTEN_PORT
} from './config';
import mongoConnect from 'utils/mongo/mongoClientConnect';
import expressConnectMongo from 'connect-mongo';
const MongoSessionStore = expressConnectMongo(session);

const initClustWorkerAPIServer = (app, io) => {
  // Apply custom response headers
  app.all('*', (req, res, next) => {
    for (const [header, value] of Object.entries(EXPRESS_CUSTOM_RESPONSE_HEADERS)) {
      res.header(header, value);
    }
    next();
  });

  // Allow parsing of post json body
  app.use(express.json());

  // Session management
  // @see https://www.npmjs.com/package/express-session
  (() => {
    // Number of proxies Express is behind
    // app.set('trust proxy', 1) // trust first proxy

    // @see https://nodesource.com/blog/nine-security-tips-to-keep-express-from-getting-pwned/

    app.use(session({
      secret: 'keyboard-cat', // TODO: Use centralized config
      key: 'shell-session', // The name of the cookie - if left default (connect.sid), it can be detected and give away that an application is using Express as a web server.
      // store: // TODO: Handle store; currently defaults to MemoryStore
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false // TODO: Set to true if using secure session
      },
      store: new MongoSessionStore({
        clientPromise: mongoConnect()
      })
    }), (req, res, next) => {
      // console.log(req.session);
      next();
    });

  })();

  // Socket.io
  (() => {
    // TODO: Include any specific URL routes in log output here

    console.log(`Starting Socket.io Server (via Express Server on *:${HTTP_LISTEN_PORT})`);

    io.on('connection', (socket) => {
      console.log(`Socket.io Client connected with id: ${socket.id}`);

      // Initialize the Socket Routes with the socket
      initSocketAPIRoutes(socket, io);

      // Emit to everyone we're connected
      // TODO: Limit this to only namespaces the socket is connected to
      // @see https://socket.io/docs/emit-cheatsheet/
      socket.broadcast.emit(SOCKET_API_EVT_PEER_CONNECT, socket.id);

      socket.on('disconnect', () => {
        // Emit to everyone we're disconnected
        // TODO: Limit this to only namespaces the socket was connected to
        socket.broadcast.emit(SOCKET_API_EVT_PEER_DISCONNECT, socket.id);

        console.log(`Socket.io Client disconnected with id: ${socket.id}`);
      });
    });

    console.log(`Socket.io Server (Express / *:${HTTP_LISTEN_PORT}) started`);
  })();

  // Middleware for obtaining client's real IP address
  // @see https://stackfame.com/get-ip-address-node
  (() => {
    // you can override which attribute the ip will be set on by
    // passing in an options object with an attributeName
    app.use(requestIp.mw({
      attributeName: 'clientIP'
    }));
  })();

  // Express API routes
  app.use('/', expressAPIRoutes);

  // Backend static routes
  // Note: The React frontend Shell application's public files are not located
  // here
  app.use(express.static(PATH_PUBLIC));

  // React Frontend Proxy
  // Note: Development /sockjs-node proxying is handled directly by nginx
  // reverse proxy, at time of writing
  (() => {
    const reactProxy = httpProxy.createProxyServer();

    app.get('/*', (req, res) => {
      reactProxy.web(req, res, { target: FRONTEND_PROXY_URL }, (err) => {
        // TODO: Implement better frontend server error handling
        console.error(err);
        res.status(404).send('Frontend server offline');
      });
    });

  })();
};

export default initClustWorkerAPIServer;