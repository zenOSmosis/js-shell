import io from 'socket.io-client';
import config from './../config';
import socketQuery from './socketQuery';
import SocketLinkedState from '../state/SocketLinkedState';
import socketAPIRoutes from './socketAPIRoutes';

const socketLinkedState = new SocketLinkedState();

// TODO: Wrap w/ LinkedState
// TODO: Enable multiple connections

const socket = io.connect(config.SOCKET_IO_URI);

/**
 * Overrides socket.disconnect() with request disconnect event, as there does
 * not seem to be a way to disconnect the Socket directly from the client side.
 */
socket.disconnect = () => {
  socket.emit(socketAPIRoutes.SOCKET_API_ROUTE_REQUEST_DISCONNECT);
};

socket.on('connect', () => {
  console.debug('Socket.io connected', socket);

  const {id: socketId} = socket;

  socketLinkedState.setState({
    isConnected: true,
    socketId
  });
});

socket.on('disconnect', () => {
  console.debug('Socket.io disconnected', socket);

  socketLinkedState.setState({
    isConnected: false,
    socketId: null
  });
});

socket.on('connect_error', (socketConnectError) => {
  console.warn('Socket.io connect error', socketConnectError);

  socketLinkedState.setState({
    socketConnectError
  });
});

socket.on('reconnect_attempt', (reconnectAttemptNumber) => {
  socketLinkedState.setState({
    reconnectAttemptNumber
  });
});

export default socket;
export {
  socketQuery,
  SocketLinkedState
};