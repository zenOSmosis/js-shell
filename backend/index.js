const expressServer = require('./servers/expressServer');
const socketIO = require('./servers/socket.io-server');

expressServer.start();
socketIO.start();