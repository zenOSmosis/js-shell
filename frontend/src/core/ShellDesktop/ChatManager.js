// TODO: Rename to P2PDelegate, or something along those lines

import ClientProcess, { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import ChatMessage from 'utils/p2p/ChatMessage';
import P2PLinkedState, {
  STATE_LAST_RECEIVED_SOCKET_PEER_DATA_PACKET,

  ACTION_CACHE_CHAT_MESSAGE,
  ACTION_GET_CACHED_CHAT_MESSAGE_WITH_UUID,

  ACTION_UPDATE_CACHED_CHAT_MESSAGE_WITH_UUID
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

      this.on(EVT_BEFORE_EXIT, () => {
        this._p2pLinkedState.destroy();
        this._p2pLinkedState = null;
      });

      this._p2pLinkedState.on('update', (updatedState) => {
        try {
          const { [STATE_LAST_RECEIVED_SOCKET_PEER_DATA_PACKET]: receivedSocketPeerData } = updatedState;

          if (receivedSocketPeerData !== undefined) {
            if (receivedSocketPeerData.packetType &&
                receivedSocketPeerData.packetType === 'ChatMessage') {

              const messageUUID = receivedSocketPeerData.data.messageUUID;

              let chatMessage = this._p2pLinkedState.dispatchAction(ACTION_GET_CACHED_CHAT_MESSAGE_WITH_UUID, messageUUID);

              if (!chatMessage) {
                chatMessage = new ChatMessage(false, receivedSocketPeerData.data.fromSocketPeerID, receivedSocketPeerData.data.toSocketPeerID, receivedSocketPeerData.data);

                // Add the chat message to the cache
                this._p2pLinkedState.dispatchAction(ACTION_CACHE_CHAT_MESSAGE, chatMessage);
              } else {
                // Manipulate existing

                this._p2pLinkedState.dispatchAction(ACTION_UPDATE_CACHED_CHAT_MESSAGE_WITH_UUID, messageUUID, (updatableChatMessage) => {
                  updatableChatMessage.setSharedData(receivedSocketPeerData.data);

                  const updatedChatMessage = updatableChatMessage;

                  return updatedChatMessage;
                });
              }
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