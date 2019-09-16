// TODO: Rename to P2PDelegate, or something along those lines

import ClientProcess, { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import P2PLinkedState, { STATE_LAST_RECEIVED_SOCKET_PEER_DATA } from 'state/P2PLinkedState';

/**
 * Listens to P2P actions and bind them to P2PLinkedState.
 * 
 * @extends ClientProcess
 */
class ChatManager extends ClientProcess {
  constructor(...args) {
    super(...args);

    this._p2pLinkedState = null;
  }

  async _init() {
    try {
      this.setTitle('Chat Manager');

      this._p2pLinkedState = new P2PLinkedState();

      this._p2pLinkedState.on('update', (updatedState) => {
        const { [STATE_LAST_RECEIVED_SOCKET_PEER_DATA]: receivedSocketPeerData } = updatedState;

        if (typeof receivedSocketPeerData !== undefined) {
          console.debug({
            receivedSocketPeerData
          });
        }
      });

      await super._init();
    } catch (exc) {
      throw exc;
    }
  }
}

export default ChatManager;