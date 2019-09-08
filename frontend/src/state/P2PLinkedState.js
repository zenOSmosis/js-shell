import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';

export {
  EVT_LINKED_STATE_UPDATE
};

export const P2P_LINKED_STATE_SCOPE_NAME = 'p2pConnections';

export const STATE_SOCKET_PEER_IDS = 'socketPeerIDs';
export const STATE_WEBRTC_CONNECTIONS = 'webRTCConnections';

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
      [STATE_WEBRTC_CONNECTIONS]: []
    });
  }

  /**
   * TODO: Rename to setSocketPeerIDIds
   */
  setSocketPeerIDs(socketPeerIDs = []) {
    if (!Array.isArray(socketPeerIDs)) {
      throw new Error('socketPeerIDs is not an array');
    }

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