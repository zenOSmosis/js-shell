const {http, HTTP_LISTEN_PORT} = require('./expressServer');
const io = require('socket.io')(http);
const socketRoutes = require('../api/socket.io/routes');

const start = () => {
  // TODO: Include any specific URL routes in log output here

  console.log(`Starting Socket.io Server (via Express Server on *:${HTTP_LISTEN_PORT})`);

  io.on('connection', (socket) => {
    console.log(`Socket.io Client connected with id: ${socket.id}`);

    socketRoutes.initSocket(socket);
  
    socket.on('disconnect', () => {
      console.log(`Socket.io Client disconnected with id: ${socket.id}`);
    });
  });

  console.log(`Socket.io Server (Express / *:${HTTP_LISTEN_PORT}) started`);
};

module.exports = {
  io,
  start
};