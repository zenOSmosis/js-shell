const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const session = require('express-session');
const server = require('http').Server(app);
const httpProxy = require('http-proxy');
const requestIp = require('request-ip');
const expressRoutes = require('../api/express/routes');
const io = require('socket.io')(server);
const socketAPIRoutes = require('../api/socket.io/routes');
const { SOCKET_API_EVT_PEER_CONNECT, SOCKET_API_EVT_PEER_DISCONNECT } = require('../api/socket.io/events');
const config = require('../config');
const { PATH_PUBLIC, FRONTEND_PROXY_URI, FRONTEND_WS_PROXY_URI, HTTP_LISTEN_PORT } = config;

// Apply custom reponse headers
app.all('*', (req, res, next) => {
  const { EXPRESS_CUSTOM_RESPONSE_HEADERS } = config;
  for (const [header, value] of Object.entries(EXPRESS_CUSTOM_RESPONSE_HEADERS)) {
    res.header(header, value);
  }
  next();
});

// Session management
// @see https://www.npmjs.com/package/express-session
(() => {
  // Number of proxies Express is behind
  // app.set('trust proxy', 1) // trust first proxy

  app.use(session({
    secret: 'keyboard cat', // TODO: Use centralized config
    // store: // TODO: Handle store; currently defaults to MemoryStore
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false // TODO: Set to true if using secure session
    }
  }), (req, res, next) => {
    // console.log(req.session);
    next();
  });
})();

// Socket.io
(() => {
  // TODO: Include any specific URL routes in log output here

  console.log(`Starting Socket.io Server (via Express Server on *:${HTTP_LISTEN_PORT})`);

  // TODO: Use socket.io-adapter instead; this is rudimentary and not scalable
  let socketConnections = [];

  io.on('connection', (socket) => {
    console.log(`Socket.io Client connected with id: ${socket.id}`);

    // Initialize the Socket Routes with the socket
    socketAPIRoutes.initSocket(socket);

    // Add socket to socketConnections
    socketConnections.push(socket);

    // Emit to everyone we're connected
    // TODO: Limit this to only namespaces the socket is connected to
    // @see https://socket.io/docs/emit-cheatsheet/
    socket.broadcast.emit(SOCKET_API_EVT_PEER_CONNECT, socket.id);

    socket.fetchServerConnections = () => {
      const socketId = socket.id;

      // return socketConnections;
      return socketConnections.map(connection => {
        return connection.id;
      }).filter(connectionId => {
        return socketId !== connectionId;
      });
    };

    socket.on('disconnect', () => {
      // Remove socket from socketConnections
      socketConnections = socketConnections.filter((socketConnection) => {
        return (!Object.is(socket, socketConnection));
      });

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

// Backend static routes
// Note: The React frontend Shell application's public files are not located
// here
app.use(express.static(PATH_PUBLIC));

// Express API routes
app.use('/', expressRoutes);

// Proto generic WSS proxy
/*
(() => {
  const genProxyWS = httpProxy.createProxyServer({ws: true});
  // genProxy

  app.all('/ws-proxy', (req, res, next) => {
    const { wsProxyAddress } = req.query;

    // res.send('...');

    console.log('ws proxy address', wsProxyAddress);

    genProxyWS.web(req, res, {target: wsProxyAddress}, (err) => {
      console.error(err);
      next();
    });
  });
})();
*/

// React Frontend Proxy
(() => {
  const reactProxy = httpProxy.createProxyServer();
  const reactProxyWS = httpProxy.createProxyServer({ ws: true });

  /*
  reactProxy.on('upgrade', () => {
    console.debug('upgrading proxy...');
  });
  */

  app.get('/*', (req, res) => {
    reactProxy.web(req, res, { target: FRONTEND_PROXY_URI }, (err) => {
      // TODO: Implement better frontend server error handling
      console.error(err);
      res.status(404).send('Frontend server offline');
    });
  });

  app.all('/sockjs-node/*', (req, res, next) => {
    const pathName = req.originalUrl;

    console.log('regular', FRONTEND_PROXY_URI + pathName);

    // res.send(FRONTEND_PROXY_URI + pathName);

    reactProxy.web(req, res, { target: FRONTEND_PROXY_URI + pathName }, (err) => {
      console.error(err);
      next();
    });

    // next();
  });

  // TODO: Prototype w/: wscat -n --connect wss://0.0.0.0/sockjs-node/842/htbc4sby/websocket
  expressWs.app.ws('/sockjs-node/*', (ws, res, next) => {
    console.log('ws', ws);

    const pathName = ws.originalUrl;

    reactProxyWS.ws(ws, res, { target: FRONTEND_WS_PROXY_URI + pathName }, (err) => {
      console.error(err);
      next();
    });

    // next();
  });
})();

/**
 * Starts the Express server.
 */
const start = () => {
  console.log(`Starting Express Server on *:${HTTP_LISTEN_PORT}`);

  // WARNING: app.listen(80) will NOT work here
  // @see https://socket.io/docs/
  server.listen(HTTP_LISTEN_PORT, () => {
    console.log(`Express Server listening on *:${HTTP_LISTEN_PORT}`);
  });
};

module.exports = {
  app,
  expressRoutes,
  start,
  HTTP_LISTEN_PORT
};