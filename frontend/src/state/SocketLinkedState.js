import LinkedState, {EVT_LINKED_STATE_UPDATE} from './LinkedState';
import fetchClientIP from 'utils/fetchClientIP';
export {
  EVT_LINKED_STATE_UPDATE
};

const SOCKET_LINKED_SCOPE_NAME = 'socket-linked-scope';

export const CONNECTION_STATUS_CONNECTED = 'connected';
export const CONNECTION_STATUS_DISCONNECTED = 'disconnected';
export const CONNECTION_STATUS_RECONNECTING = 'reconnecting';
export const CONNECTION_STATUS_ERROR = 'error';

export default class SocketLinkedState extends LinkedState {
  constructor() {
    super(SOCKET_LINKED_SCOPE_NAME, {
      hostURL: null, //socket.io.uri,
      socketId: null,
      isConnected: false, // socket.io.connected
      isReconnecting: false, //socket.io.reconnecting
      reconnectAttemptNumber: 0,
      socketConnectError: null,
      
      connectionStatus: null,
      
      clientIP: null,
      serverIP: null
    });
  }
}

// Socket event decorations
(() => {
  const socketLinkedState = new SocketLinkedState();

  const getUpdatedConnectionStatus = (updatedState) => {
    const {
        isConnected,
        isReconnecting,
        socketConnectError
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
    const {isConnected} = updatedState;

    const updatedConnectionStatus = getUpdatedConnectionStatus(updatedState);
    if (typeof updatedConnectionStatus !== 'undefined') {
      socketLinkedState.setState({
        connectionStatus: updatedConnectionStatus
      });
    }

    if (typeof isConnected !== 'undefined') {
      if (isConnected) {
        // Fetch IP
        const clientIP = await fetchClientIP();
        
        socketLinkedState.setState({
          clientIP
        });
      } else {
        // Not connected
        socketLinkedState.setState({
          clientIP: null,
          serverIP: null
        });
      }
    }
  });
})();