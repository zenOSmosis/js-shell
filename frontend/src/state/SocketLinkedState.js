import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';
import fetchClientIP from 'utils/fetchClientIP';
export {
  EVT_LINKED_STATE_UPDATE
};

const SOCKET_LINKED_SCOPE_NAME = 'socket-linked-scope';

export const CONNECTION_STATUS_CONNECTED = 'connected';
export const CONNECTION_STATUS_DISCONNECTED = 'disconnected';
export const CONNECTION_STATUS_RECONNECTING = 'reconnecting';
export const CONNECTION_STATUS_ERROR = 'error';

export const STATE_HOST_URL = 'hostURL';
export const STATE_SOCKET_ID = 'socketId';
export const STATE_IS_CONNECTED = 'isConnected';
export const STATE_IS_RECONNECTING = 'isReconnecting';
export const STATE_RECONNECT_ATTEMPT_NUMBER = 'reconnectAttemptNumber';
export const STATE_SOCKET_CONNECT_ERROR = 'socketConnectError';
export const STATE_CONNECTION_STATUS = 'connectionStatus';
export const STATE_CLIENT_IP = 'clientIP';
export const STATE_SERVER_IP = 'serverIP';

export default class SocketLinkedState extends LinkedState {
  constructor() {
    super(SOCKET_LINKED_SCOPE_NAME, {
      [STATE_HOST_URL]: null, //socket.io.uri,
      [STATE_SOCKET_ID]: null,
      [STATE_IS_CONNECTED]: false, // socket.io.connected
      [STATE_IS_RECONNECTING]: false, //socket.io.reconnecting
      [STATE_RECONNECT_ATTEMPT_NUMBER]: 0,
      [STATE_SOCKET_CONNECT_ERROR]: null,

      [STATE_CONNECTION_STATUS]: null,

      [STATE_CLIENT_IP]: null,
      [STATE_SERVER_IP]: null
    });
  }
}

// Socket event decorations
(() => {
  const socketLinkedState = new SocketLinkedState();

  const getUpdatedConnectionStatus = (updatedState) => {
    const {
      [STATE_IS_CONNECTED]: isConnected,
      [STATE_IS_RECONNECTING]: isReconnecting,
      [STATE_SOCKET_CONNECT_ERROR]: socketConnectError
    } = updatedState;

    if (typeof isConnected !== 'undefined') {
      if (isConnected) {
        return CONNECTION_STATUS_CONNECTED;
      } else {
        return CONNECTION_STATUS_DISCONNECTED;
      }
    }

    if (typeof isReconnecting !== 'undefined') {
      if (isReconnecting) {
        return CONNECTION_STATUS_RECONNECTING;
      }
    }

    if (typeof socketConnectError !== 'undefined') {
      if (socketConnectError) {
        return CONNECTION_STATUS_ERROR;
      }
    }

    return undefined;
  };

  socketLinkedState.on(EVT_LINKED_STATE_UPDATE, async (updatedState) => {
    const { [STATE_IS_CONNECTED]: isConnected } = updatedState;

    const updatedConnectionStatus = getUpdatedConnectionStatus(updatedState);
    if (typeof updatedConnectionStatus !== 'undefined') {
      socketLinkedState.setState({
        [STATE_CONNECTION_STATUS]: updatedConnectionStatus
      });
    }

    if (typeof isConnected !== 'undefined') {
      if (isConnected) {
        // Fetch IP
        const clientIP = await fetchClientIP();

        socketLinkedState.setState({
          [STATE_CLIENT_IP]: clientIP
        });
      } else {
        // Not connected
        socketLinkedState.setState({
          [STATE_CLIENT_IP]: null,
          [STATE_SERVER_IP]: null
        });
      }
    }
  });
})();