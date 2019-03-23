import io from 'socket.io-client';
import {SOCKET_IO_URL} from './../config';
var socket = io.connect(SOCKET_IO_URL);

socket.on('connect', () => {
  console.debug('Socket.io connected', socket);
});

socket.on('disconnect', () => {
  console.debug('Socket.io disconnected', socket);
});

export default socket;