import io from 'socket.io-client';
import { SOCKET_IO_URL } from 'config';
import SocketLinkedState from 'state/SocketLinkedState';
import { SOCKET_API_ROUTE_REQUEST_DISCONNECT } from 'shared/socketAPI/socketAPIRoutes';

const socketLinkedState = new SocketLinkedState();

// Important!  These should not be renamed as they are specific to Socket.io
export const EVT_SOCKET_CONNECT = 'connect';
export const EVT_SOCKET_DISCONNECT = 'disconnect';
export const EVT_SOCKET_CONNECT_ERROR = 'connect_error';
export const EVT_SOCKET_RECONNECT_ATTEMPT = 'reconnect_attempt';

// TODO: Wrap w/ LinkedState
// TODO: Enable multiple connections

const socket = io.connect(SOCKET_IO_URL);

/**
 * Overrides socket.disconnect() with request disconnect event, as there does
 * not seem to be a way to disconnect the Socket directly from the client side.
 */
socket.disconnect = () => {
  socket.emit(SOCKET_API_ROUTE_REQUEST_DISCONNECT);
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

/**
 * @return {string | null} Returns null if the local user is not online.
 */
const getSocketID = () => {
  const { socketId } = socketLinkedState.getState();

  return socketId;
};

export default socket;
export {
  SocketLinkedState,
  getSocketID
};