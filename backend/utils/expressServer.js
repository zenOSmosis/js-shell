const app = require('express')();
const http = require('http').Server(app);
const expressRoutes = require('../api/express/routes');

// TODO: Move this to a central config
const HTTP_LISTEN_PORT = 3001;

app.use('/', expressRoutes);

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
  start
};