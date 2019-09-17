// TODO: Rename to P2PDelegate, or something along those lines

import ClientProcess, { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import P2PLinkedState, {
  STATE_LAST_RECEIVED_SOCKET_PEER_DATA_PACKET,

  ACTION_CACHE_DATA_PACKET,
  ACTION_GET_CACHED_DATA_PACKETS
} from 'state/P2PLinkedState';

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
        try {
          const { [STATE_LAST_RECEIVED_SOCKET_PEER_DATA_PACKET]: receivedSocketPeerData } = updatedState;

          if (receivedSocketPeerData !== undefined) {
            if (receivedSocketPeerData.packetType &&
                receivedSocketPeerData.packetType === 'chatMessage') {
              
              // Add the chat message to the log
              this._p2pLinkedState.dispatchAction(ACTION_CACHE_DATA_PACKET, receivedSocketPeerData);

              const chatMessages = this._p2pLinkedState.dispatchAction(ACTION_GET_CACHED_DATA_PACKETS);
  
              // TODO: Remove
              console.debug({
                chatMessages
              });
            }
          }

        } catch (exc) {
          throw exc;
        }
      });

      await super._init();
    } catch (exc) {
      throw exc;
    }
  }
}

export default ChatManager;