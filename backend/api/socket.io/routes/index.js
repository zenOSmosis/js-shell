const networkInterfaces = require('./networkInterfaces');
const apps = require('./apps');
const sysCommand = require('./sysCommand');

/**
 * Initializes socket.io routes for the given socket connection.
 * 
 * TODO: Adjust socket param type to reflect actual type (instead of generic
 * object).
 * 
 * @param {object} socket A socket.io socket.
 */
const init = (socket) => {
  console.log(`Initializing Socket.io routes for socket with id: ${socket.id}`);
  
  socket.on('fetch-apps', apps);
  socket.on('fetch-network-interfaces', networkInterfaces)
  socket.on('sys-command', sysCommand);
  
  console.log(`Initialized Socket.io routes for socket with id: ${socket.id}`);
};

module.exports = {
  init
};