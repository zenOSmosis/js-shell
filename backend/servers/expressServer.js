const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const httpProxy = require('http-proxy');
const expressRoutes = require('../api/express/routes');
const config = require('../config');
const {FRONTEND_PROXY_URI, HTTP_LISTEN_PORT} = config;

const PATH_PUBLIC = path.resolve(__dirname, '../public');

// All express routes
(() => {
  // Static routes
  // Note: The React frontend Shell application's public files are not located
  // here
  app.use(express.static(PATH_PUBLIC));

  // Express API routes
  app.use('/', expressRoutes);

  // React Frontend Proxy
  (() => {
    const idmProxy = httpProxy.createProxyServer();
    const idmProxyWS = httpProxy.createProxyServer({ws: true});
    app.get('/*', (req, res) => {
      idmProxy.web(req, res, {target: FRONTEND_PROXY_URI});
    });
    app.all('/sockjs-node/*', (req, res) => {
      idmProxyWS.web(req, res, {target: FRONTEND_PROXY_URI});
    });
  })();
})();

const start = () => {
  console.log(`Starting Express Server on *:${HTTP_LISTEN_PORT}`)

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