const expressServer = require('./utils/expressServer');
const socketIO = require('./utils/socket.io-server');

expressServer.start();
socketIO.start();

/*
console.log({
  expressServer,
  socketIO
});
*/