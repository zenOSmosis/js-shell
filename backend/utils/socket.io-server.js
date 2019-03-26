const {http} = require('./expressServer');
const io = require('socket.io')(http);

const requestApps = require('../api/socket.io/routes/requestApps');
const sysCommand = require('../api/socket.io/routes/sysCommand');

const start = () => {
  console.log(`Starting Socket.io Server`)

  io.on('connection', (socket) => {
    console.log(`Socket.io user connected with id: ${socket.id}`);
  
    socket.on('request-app-list', requestApps);
  
    socket.on('sys-command', sysCommand);
  
    socket.on('disconnect', () => {
      console.log(`Socket.io user disconnected with id: ${socket.id}`);
    });
  });
};

module.exports = {
  io,
  start
};