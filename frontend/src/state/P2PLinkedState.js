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
      socketPeers: [],

      // Peers which are directly connected via P2P
      p2pConnections: []
    });
  }

  /**
   * TODO: Rename to setSocketPeerIds
   */
  setSocketPeers(socketPeers = []) {
    if (!Array.isArray(socketPeers)) {
      throw new Error('socketPeers is not an array');
    }

    this.setState({
      socketPeers
    });
  }

  /**
   * TODO: Rename to addSocketPeer
   * 
   * @param {number} socketPeer 
   */
  addSocketPeer(socketPeer) {
    let { socketPeers } = this.getState();

    socketPeers = socketPeers || [];

    socketPeers.push(socketPeer);

    this.setState({
      socketPeers
    });
  }

  /**
   * TODO: Rename to removeSocketPeerId
   * 
   * @param {number} socketPeer 
   */
  removeSocketPeer(socketPeer) {
    let { socketPeers } = this.getState();

    socketPeers = socketPeers || [];

    socketPeers = socketPeers.filter(testSocketPeer => {
      return !Object.is(socketPeer, testSocketPeer);
    });

    this.setState({
      socketPeers
    });
  }

  // add / remove p2p
}