import io from 'socket.io-client';
import config from './../config';
import socketQuery from './socketQuery';
import SocketLinkedState from '../state/SocketLinkedState';
import socketAPIRoutes from 'shared/socketAPI/socketAPIRoutes';

const socketLinkedState = new SocketLinkedState();

// Important!  These should not be renamed as they are specific to Socket.io
export const EVT_SOCKET_CONNECT = 'connect';
export const EVT_SOCKET_DISCONNECT = 'disconnect';
export const EVT_SOCKET_CONNECT_ERROR = 'connect_error';
export const EVT_SOCKET_RECONNECT_ATTEMPT = 'reconnect_attempt';

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

// Socket connect
socket.on(EVT_SOCKET_CONNECT, () => {
  console.debug('Socket.io connected', socket);

  const {id: socketId} = socket;

  socketLinkedState.setState({
    isConnected: true,
    socketId
  });
});

// Socket disconnect
socket.on(EVT_SOCKET_DISCONNECT, () => {
  console.debug('Socket.io disconnected', socket);

  socketLinkedState.setState({
    isConnected: false,
    socketId: null
  });
});

// Socket connect error
socket.on(EVT_SOCKET_CONNECT_ERROR, (socketConnectError) => {
  console.warn('Socket.io connect error', socketConnectError);

  socketLinkedState.setState({
    socketConnectError
  });
});

// Socket reconnect attempt
socket.on(EVT_SOCKET_RECONNECT_ATTEMPT, (reconnectAttemptNumber) => {
  socketLinkedState.setState({
    reconnectAttemptNumber
  });
});

export default socket;
export {
  socketQuery,
  SocketLinkedState
};