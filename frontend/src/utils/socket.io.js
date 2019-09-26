import io from 'socket.io-client';
import { SOCKET_IO_URL } from 'config';
import SocketLinkedState, {
  STATE_SOCKET_ID,
  STATE_IS_CONNECTED,
  STATE_RECONNECT_ATTEMPT_NUMBER,
  STATE_SOCKET_AUTHENTICATION_ERROR,
  STATE_SOCKET_CONNECT_ERROR
} from 'state/SocketLinkedState';
import { SOCKET_API_ROUTE_REQUEST_DISCONNECT } from 'shared/socketAPI/socketAPIRoutes';
import { SOCKET_API_EVT_AUTHENTICATION_ERROR } from 'shared/socketAPI/socketAPIEvents';

const socketLinkedState = new SocketLinkedState();

// Important!  These should not be renamed as they are specific to Socket.io
export const EVT_SOCKET_CONNECT = 'connect';
export const EVT_SOCKET_DISCONNECT = 'disconnect';
export const EVT_SOCKET_CONNECT_ERROR = 'connect_error';
export const EVT_SOCKET_RECONNECT_ATTEMPT = 'reconnect_attempt';

const socket = io.connect(SOCKET_IO_URL, {
  autoConnect: false
});

/**
 * Overrides socket.disconnect() with request disconnect event, as there does
 * not seem to be a way to disconnect the Socket directly from the client side.
 */
// TODO: Use socket.close() on client
socket.disconnect = () => {
  socket.emit(SOCKET_API_ROUTE_REQUEST_DISCONNECT);
};

// Socket connect
socket.on(EVT_SOCKET_CONNECT, () => {
  console.debug('Socket.io connected', socket);

  const {id: socketId} = socket;

  socketLinkedState.setState({
    [STATE_IS_CONNECTED]: true,
    [STATE_SOCKET_ID]: socketId
  });
});

socket.on(SOCKET_API_EVT_AUTHENTICATION_ERROR, (reason) => {
  socketLinkedState.setState({
    [STATE_SOCKET_AUTHENTICATION_ERROR]: reason
  });
});

// Socket connect error
socket.on(EVT_SOCKET_CONNECT_ERROR, (socketConnectError) => {
  console.error('Socket.io connect error', socketConnectError);

  socketLinkedState.setState({
    [STATE_SOCKET_CONNECT_ERROR]: socketConnectError
  });
});

// Socket disconnect
socket.on(EVT_SOCKET_DISCONNECT, () => {
  console.debug('Socket.io disconnected', socket);

  socketLinkedState.setState({
    [STATE_IS_CONNECTED]: false,
    [STATE_SOCKET_ID]: null
  });
});

// Socket reconnect attempt
socket.on(EVT_SOCKET_RECONNECT_ATTEMPT, (reconnectAttemptNumber) => {
  socketLinkedState.setState({
    [STATE_RECONNECT_ATTEMPT_NUMBER]: reconnectAttemptNumber
  });
});

/**
 * Connects to Socket.io backend with custom authentication.
 * 
 * IMPORTANT! Should only be called by core/ShellDesktop/LocalUserController.
 * 
 * @param {Object} authParams 
 */
const openAuthenticate = (authParams) => {
  // Close existing connection, if present
  socket.close();

  // Set initial polling transport options before upgrade to WebSocket
  socket.io.opts.transportOptions = {
    polling: {
      extraHeaders: {
        'x-shell-authenticate': JSON.stringify(authParams)
      }
    }
  };

  // Connect the socket
  socket.open();
};

/**
 * @return {string | null} Returns null if the local user is not online.
 */
const getSocketId = () => {
  const { socketId } = socketLinkedState.getState();

  return socketId;
};

/**
 * @return {boolean}
 */
const getIsConnected = () => {
  const socketId = getSocketId();

  return (socketId ? true : false);
};

export default socket;
export {
  openAuthenticate,
  SocketLinkedState,
  getSocketId,
  getIsConnected
};