import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';

export {
  EVT_LINKED_STATE_UPDATE
};

export const P2P_LINKED_STATE_SCOPE_NAME = 'p2pConnections';

/**
 * Manages peer-to-peer (P2P) connectivity.
 * 
 * @extends LinkedState
 */
export default class P2PLinkedState extends LinkedState {
  constructor() {
    super(P2P_LINKED_STATE_SCOPE_NAME, {
      // Peers which are connected over Socket.io (proxied through server)
      socketPeerIDs: [],

      // Peers which are directly connected via WebRTC
      webRTCConnections: []
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
      socketPeerIDs
    });
  }

  /**
   * TODO: Rename to addSocketPeerID
   * 
   * @param {number} socketPeerID 
   */
  addSocketPeerID(socketPeerID) {
    let { socketPeerIDs } = this.getState();

    socketPeerIDs = socketPeerIDs || [];

    socketPeerIDs.push(socketPeerID);

    this.setState({
      socketPeerIDs
    });
  }

  /**
   * TODO: Rename to removeSocketPeerIDId
   * 
   * @param {number} socketPeerID 
   */
  removeSocketPeerID(socketPeerID) {
    let { socketPeerIDs } = this.getState();

    socketPeerIDs = socketPeerIDs || [];

    socketPeerIDs = socketPeerIDs.filter(testSocketPeerID => {
      return !Object.is(socketPeerID, testSocketPeerID);
    });

    this.setState({
      socketPeerIDs
    });
  }

  // add / remove p2p
}