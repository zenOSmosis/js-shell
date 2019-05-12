import LinkedState, {EVT_LINKED_STATE_UPDATE} from './LinkedState';

export {
  EVT_LINKED_STATE_UPDATE
};

const SOCKET_LINKED_SCOPE_NAME = 'socket-linked-scope';

export default class SocketLinkedState extends LinkedState {
  constructor() {
    super(SOCKET_LINKED_SCOPE_NAME, {
      hostURI: null, //socket.io.uri,
      socketId: null,
      isConnected: false, // socket.io.connected
      isReconnecting: false, //socket.io.reconnecting
      reconnectAttemptNumber: 0,
      socketConnectError: null
    });
  }
}