import io from 'socket.io-client';
import config from './../config';

// TODO: Wrap w/ LinkedState
// TODO: Enable multiple connections

var socket = io.connect(config.SOCKET_IO_URI);

socket.on('connect', () => {
  console.debug('Socket.io connected', socket);
});

socket.on('disconnect', () => {
  console.debug('Socket.io disconnected', socket);
});

export default socket;