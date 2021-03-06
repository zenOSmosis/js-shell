import express from 'express';
import session from 'express-session';
import httpProxy from 'http-proxy';
import requestIp from 'request-ip';
import expressAPIRoutes from './api/express/routes';
import { initSocketAPIRoutes } from './api/socket.io/routes';
import { SOCKET_API_EVT_PEER_ID_CONNECT, SOCKET_API_EVT_PEER_ID_DISCONNECT } from './api/socket.io/events';
import {
  EXPRESS_CUSTOM_RESPONSE_HEADERS,
  PATH_PUBLIC,
  FRONTEND_PROXY_URL,
  HTTP_LISTEN_PORT
} from './config';
import mongoConnect from 'utils/mongo/mongoClientConnect';
import expressConnectMongo from 'connect-mongo';
import { SOCKET_API_EVT_AUTHENTICATION_ERROR } from './api/socket.io/events';
import _setIO from 'utils/socketIO/_setIO';
import { setUserData, fetchUserSocketId } from './utils/mongo/collections/users';

const MongoSessionStore = expressConnectMongo(session);

let _isInitStarted = false;

const initClusterWorkerAPIServer = (app, io) => {
  // Prevent trying to initialize more than once
  if (_isInitStarted) {
    throw new Error('CluserWorkerAPIServer is already init');
  } else {
    _isInitStarted = true;
  }

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
        secure: false // Intentionally not forcing weak integrity due to it not
        // setting in development environment, and thus, may not work correctly
        // in some staging environments.
        // "This issue is officially referred to as Weak Integrity."
        // @see https://en.wikipedia.org/wiki/Secure_cookie
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
    // Set the Socket.io variable so that other scripts can use it
    _setIO(io);

    // TODO: Remove defunct user sockets on startup
    // Remove user sockets which do not have a logged-in user

    console.log(`Starting Socket.io Server (via Express Server on *:${HTTP_LISTEN_PORT})`);
  
    // Socket.io authentication middleware (naive implementation)
    // Middleware documentation buried deep in Socket.io documentation
    // @see https://socket.io/docs/migrating-from-0-9/
    io.use(async (socket, next) => {
      try {
        const userId = await (async () => {
          try {
            const rawHeader = socket.handshake.headers['x-shell-authenticate'];
  
            if (!rawHeader) {
              throw new Error('No x-auth header present');
            }
  
            const xAuth = JSON.parse(rawHeader);
            const { userId } = xAuth;

            if (!userId) {
              throw new Error('No userId present');
            }

            // Prevent multiple connections from same browser
            const userSocketId = await fetchUserSocketId(userId);
            if (userSocketId) {
              throw new Error('User / Device is already connected');
            }

            // Associate socketId with userData
            await setUserData({
              sharedData: {
                userId
              }
            }, socket);

            return userId;
          } catch (exc) {
            throw exc;
          }
        })();

        // Add userId as property to socket
        socket.userId = userId;

        // Must call next, regardless of whether authentication was performed or not
        next();
      } catch (exc) {
        console.error(exc);

        socket.authenticationError = exc.toString();
        next();
      }
    });

    io.on('connection', async (socket) => {
      try {
        if (socket.authenticationError) {
          socket.emit(SOCKET_API_EVT_AUTHENTICATION_ERROR, socket.authenticationError);
          socket.disconnect();
          return;
        }

        // Initialize the Socket Routes with the socket
        // TODO: Include any specific URL routes in log output here
        initSocketAPIRoutes(socket, io);

        const { userId } = socket;

        console.log(`Socket.io Client connected\n`, {
          socketId: socket.id,
          userId
        });

        // Emit to everyone we're connected
        // TODO: Limit this to only namespaces the socket is connected to
        // @see https://socket.io/docs/emit-cheatsheet/
        socket.broadcast.emit(SOCKET_API_EVT_PEER_ID_CONNECT, userId);

        // Handle socket disconnect
        socket.on('disconnect', async () => {
          try {
            // Emit to everyone we're disconnected
            // TODO: Limit this to only namespaces the socket was connected to
            socket.broadcast.emit(SOCKET_API_EVT_PEER_ID_DISCONNECT, userId);

            console.log(`Socket.io Client disconnected\n`, {
              socketId: socket.id,
              userId
            });

            // Disassociate socketId from userData
            await setUserData({
              sharedData: {
                userId
              }
            }, null);
          } catch (exc) {
            throw exc;
          }
        });
      } catch (exc) {
        throw exc;
      }
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

export default initClusterWorkerAPIServer;