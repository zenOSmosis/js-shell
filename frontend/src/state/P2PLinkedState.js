import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';
import { getSocketID } from 'utils/socket.io';

export {
  EVT_LINKED_STATE_UPDATE
};

export const P2P_LINKED_STATE_SCOPE_NAME = 'p2pConnections';

export const STATE_SOCKET_PEER_IDS = 'socketPeerIDs';
export const STATE_WEBRTC_CONNECTIONS = 'webRTCConnections';
export const STATE_LAST_RECEIVED_SOCKET_PEER_DATA = 'lastReceivedPeerData';

export const ACTION_HANDLE_RECEIVED_SOCKET_PEER_DATA = 'handleReceivedSocketPeerData';

/**
 * Manages peer-to-peer (P2P) connectivity.
 * 
 * @extends LinkedState
 */
export default class P2PLinkedState extends LinkedState {
  constructor() {
    super(P2P_LINKED_STATE_SCOPE_NAME, {
      // Peers which are connected over Socket.io (proxied through server)
      [STATE_SOCKET_PEER_IDS]: [],

      // Peers which are directly connected via WebRTC
      [STATE_WEBRTC_CONNECTIONS]: [],

      [STATE_LAST_RECEIVED_SOCKET_PEER_DATA]: null
    }, {
      actions: {
        [ACTION_HANDLE_RECEIVED_SOCKET_PEER_DATA]: (receivedData) => {
          this.setState({
            [STATE_LAST_RECEIVED_SOCKET_PEER_DATA]: receivedData
          });
        }
      }
    });
  }

  /**
   * TODO: Rename to setSocketPeerIDIds
   */
  setSocketPeerIDs(socketPeerIDs = []) {
    if (!Array.isArray(socketPeerIDs)) {
      throw new Error('socketPeerIDs is not an array');
    }

    // Filter out local ID from peer IDs
    const socketID = getSocketID();
    socketPeerIDs = socketPeerIDs.filter(socketPeerID => {
      return socketPeerID !== socketID;
    });

    this.setState({
      [STATE_SOCKET_PEER_IDS]: socketPeerIDs
    });
  }

  /**
   * TODO: Rename to addSocketPeerID
   * 
   * @param {number} socketPeerID 
   */
  addSocketPeerID(socketPeerID) {
    const { [STATE_SOCKET_PEER_IDS]: socketPeerIDs } = this.getState();

    socketPeerIDs.push(socketPeerID);

    this.setState({
      [STATE_SOCKET_PEER_IDS]: socketPeerIDs
    });
  }

  /**
   * TODO: Rename to removeSocketPeerIDId
   * 
   * @param {number} socketPeerID 
   */
  removeSocketPeerID(socketPeerID) {
    const { [STATE_SOCKET_PEER_IDS]: socketPeerIDs } = this.getState();

    const rmIdx = socketPeerIDs.indexOf(socketPeerID);

    if (rmIdx > -1) {
      socketPeerIDs.splice(rmIdx, 1);

      this.setState({
        [STATE_SOCKET_PEER_IDS]: socketPeerIDs
      });
    }
  }

  // add / remove p2p

  /*
  addWebRTCConnection(webRTCConnection) {
    const { [STATE_WEBRTC_CONNECTIONS]: webRTCConnections } = this.getState();

    webRTCConnections.push(webRTCConnection);

    this.setState({
      [STATE_WEBRTC_CONNECTIONS]: webRTCConnections
    });
  }
  */

  /*
  removeWebRTCConnection(webRTCConnection) {
    let { [STATE_WEBRTC_CONNECTIONS]: webRTCConnections } = this.getState();

    webRTCConnections = webRTCConnections.filter(testWebRTCConnection => {

    });

    this.setState({
      [STATE_WEBRTC_CONNECTIONS]: webRTCConnections
    });
  }
  */
}