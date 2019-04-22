const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const expressRoutes = require('../api/express/routes');

// TODO: Move this to a central config
const HTTP_LISTEN_PORT = 3001;

const PATH_PUBLIC = path.resolve(__dirname, '../public');

// All express routes
(() => {
  // Static routes
  // Note: The React frontend Shell application's public files are not located
  // here
  app.use(express.static(PATH_PUBLIC));

  // Programmatic, API routes
  app.use('/', expressRoutes);
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