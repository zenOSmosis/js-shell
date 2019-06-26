const express = require('express');
const session = require('express-session');
const requestIp = require('request-ip');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const httpProxy = require('http-proxy');
const expressRoutes = require('../api/express/routes');
const config = require('../config');
const {FRONTEND_PROXY_URI, HTTP_LISTEN_PORT} = config;

const PATH_PUBLIC = path.resolve(__dirname, '../public');

// Apply custom reponse headers
app.all('*', (req, res, next) => {
  const {EXPRESS_CUSTOM_RESPONSE_HEADERS} = config;
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
    console.log(req.session);
    next();
  });
})();

// Middleware for obtaining client's real IP address
// @see https://stackfame.com/get-ip-address-node
(() => {
  // you can override which attirbute the ip will be set on by
  // passing in an options object with an attributeName
  app.use(requestIp.mw({ 
    attributeName : 'clientIP'
  }));
})();

// Static routes
// Note: The React frontend Shell application's public files are not located
// here
app.use(express.static(PATH_PUBLIC));

// Express API routes
app.use('/', expressRoutes);

// React Frontend Proxy
(() => {
  const reactProxy = httpProxy.createProxyServer();
  const reactProxyWS = httpProxy.createProxyServer({ws: true});
  app.get('/*', (req, res) => {
    reactProxy.web(req, res, {target: FRONTEND_PROXY_URI}, (err) => {
      // TODO: Implement better frontend server error handling
      console.error(err);
      res.status(404).send('Frontend server offline');
    });
  });
  app.all('/sockjs-node/*', (req, res, next) => {
    reactProxyWS.web(req, res, {target: FRONTEND_PROXY_URI}, (err) => {
      console.error(err);
      next();
    });
  });
})();

const start = () => {
  console.log(`Starting Express Server on *:${HTTP_LISTEN_PORT}`);

  http.listen(HTTP_LISTEN_PORT, () => {
    console.log(`Express Server listening on *:${HTTP_LISTEN_PORT}`);
  });
};

module.exports = {
  app,
  expressRoutes,
  http,
  start,
  HTTP_LISTEN_PORT
};