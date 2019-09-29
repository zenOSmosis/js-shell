import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';

export {
  EVT_LINKED_STATE_UPDATE
};

export const P2P_LINKED_STATE_SCOPE_NAME = 'p2pConnections';

export const STATE_CONNECTED_SOCKET_PEERS = 'connectedSocketPeers';
export const STATE_WEBRTC_CONNECTIONS = 'webRTCConnections';
export const STATE_CACHED_CHAT_MESSAGES = 'cachedChatMessages';
export const STATE_REMOTE_PEERS = 'remotePeers';
export const STATE_LAST_UPDATED_PEER = 'lastUpdatedPeer';

export const ACTION_CACHE_CHAT_MESSAGE = 'cacheChatMessage';
export const ACTION_GET_CACHED_CHAT_MESSAGES = 'getCachedChatMessages';
export const ACTION_GET_CACHED_CHAT_MESSAGE_WITH_UUID = 'getCachedChatMessageWithUuid';
export const ACTION_UPDATE_CACHED_CHAT_MESSAGE_WITH_UUID = 'updateCachedChatMessageWithUuid';
export const ACTION_SET_REMOTE_PEERS = 'setRemotePeers';
export const ACTION_ADD_REMOTE_PEER = 'addRemotePeer';
export const ACTION_REMOVE_REMOTE_PEER_WITH_ID = 'removeRemotePeerWithId';
export const ACTION_NOTIFY_PEER_UPDATE = 'notifyPeerUpdate';

/**
 * Manages peer-to-peer (P2P) connectivity.
 * 
 * @extends LinkedState
 */
export default class P2PLinkedState extends LinkedState {
  constructor() {
    super(P2P_LINKED_STATE_SCOPE_NAME, {
      // Peers which are connected over Socket.io (proxied through server)
      [STATE_CONNECTED_SOCKET_PEERS]: [],

      // Peers which are directly connected via WebRTC
      [STATE_WEBRTC_CONNECTIONS]: [],

      // TODO: Cache ChatMessages instead
      [STATE_CACHED_CHAT_MESSAGES]: [],

      [STATE_REMOTE_PEERS]: [],

      [STATE_LAST_UPDATED_PEER]: null
    }, {
      actions: {
        // Adds a chat message to the log
        // This should only be called by the ChatManager app
        [ACTION_CACHE_CHAT_MESSAGE]: (chatMessage) => {
          if (!chatMessage) {
            console.warn('chatMessage does not exist');
            return;
          }

          const currentChatMessages = this.getState(STATE_CACHED_CHAT_MESSAGES);

          currentChatMessages.push(chatMessage);

          this.setState({
            [STATE_CACHED_CHAT_MESSAGES]: currentChatMessages
          });
        },

        [ACTION_GET_CACHED_CHAT_MESSAGES]: (withFilter = null) => {
          let chatMessages = this.getState(STATE_CACHED_CHAT_MESSAGES);

          if (typeof withFilter === 'function') {
            chatMessages = chatMessages.filter(withFilter);
          }

          return chatMessages;
        },

        [ACTION_GET_CACHED_CHAT_MESSAGE_WITH_UUID]: (chatMessageUuid) => {
          const chatMessages = this.getState(STATE_CACHED_CHAT_MESSAGES);
          const lenChatMessages = chatMessages.length;

          // Walk backwards
          for (let i = lenChatMessages - 1; i >= 0; i--) {
            const testChatMessageUuid = chatMessages[i].getUuid();
            if (testChatMessageUuid === chatMessageUuid) {
              return chatMessages[i];
            }
          }
        },

        /**
         * Updates an existing chat message with updated data.
         */
        [ACTION_UPDATE_CACHED_CHAT_MESSAGE_WITH_UUID]: (chatMessageUuid, updateHandler) => {
          if (typeof updateHandler !== 'function') {
            throw new Error('updateHandler is not a function');
          }

          let chatMessages = this.getState(STATE_CACHED_CHAT_MESSAGES);

          chatMessages = chatMessages.map(chatMessage => {
            const testChatMessageUuid = chatMessage.getUuid();

            if (testChatMessageUuid === chatMessageUuid) {
              // IMPORTANT! updateHandler must return the chatMessage or it will be undefined
              chatMessage = updateHandler(chatMessage);

              if (!chatMessage) {
                throw new Error('chatMessage not returned from updateHandler');
              }
            }

            return chatMessage;
          });

          this.setState({
            [STATE_CACHED_CHAT_MESSAGES]: chatMessages
          });
        },

        [ACTION_SET_REMOTE_PEERS]: (remotePeers) => {
          this.setState({
            [STATE_REMOTE_PEERS]: remotePeers
          });
        },

        [ACTION_ADD_REMOTE_PEER]: (remotePeer) => {
          const remotePeers = this.getState(STATE_REMOTE_PEERS);

          remotePeers.push(remotePeer);

          this.setState({
            [STATE_REMOTE_PEERS]: remotePeers
          });
        },

        [ACTION_REMOVE_REMOTE_PEER_WITH_ID]: (remotePeerId) => {
          let remotePeers = this.getState(STATE_REMOTE_PEERS);
          remotePeers = remotePeers.filter(testRemotePeer => {
            const testRemotePeerId = testRemotePeer.getPeerId();

            return testRemotePeerId !== remotePeerId;
          });

          this.setState({
            [STATE_REMOTE_PEERS]: remotePeers
          });
        },

        [ACTION_NOTIFY_PEER_UPDATE]: (peer) => {
          this.setState({
            [STATE_LAST_UPDATED_PEER]: peer
          });
        }
      }
    });
  }
}