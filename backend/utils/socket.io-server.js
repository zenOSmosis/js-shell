const {http} = require('./expressServer');
const io = require('socket.io')(http);
const socketRoutes = require('../api/socket.io/routes');

const start = () => {
  console.log(`Starting Socket.io Server`)

  io.on('connection', (socket) => {
    console.log(`Socket.io user connected with id: ${socket.id}`);

    socketRoutes.init(socket);
  
    socket.on('disconnect', () => {
      console.log(`Socket.io user disconnected with id: ${socket.id}`);
    });
  });
};

module.exports = {
  io,
  start
};