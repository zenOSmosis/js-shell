import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';
import { getSocketID } from 'utils/socket.io';

export {
  EVT_LINKED_STATE_UPDATE
};

export const P2P_LINKED_STATE_SCOPE_NAME = 'p2pConnections';

export const STATE_SOCKET_PEER_IDS = 'socketPeerIDs';
export const STATE_WEBRTC_CONNECTIONS = 'webRTCConnections';
export const STATE_CACHED_CHAT_MESSAGES = 'cachedChatMessages';

export const ACTION_CACHE_CHAT_MESSAGE = 'cacheChatMessage';
export const ACTION_GET_CACHED_CHAT_MESSAGES = 'getCachedChatMessages';
export const ACTION_GET_CACHED_CHAT_MESSAGE_WITH_UUID = 'getCachedChatMessageWithUUID';
export const ACTION_UPDATE_CACHED_CHAT_MESSAGE_WITH_UUID = 'updateCachedChatMessageWithUUID';

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

      // TODO: Cache ChatMessages instead
      [STATE_CACHED_CHAT_MESSAGES]: []
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

        [ACTION_GET_CACHED_CHAT_MESSAGE_WITH_UUID]: (chatMessageUUID) => {
          const chatMessages = this.getState(STATE_CACHED_CHAT_MESSAGES);
          const lenChatMessages = chatMessages.length;

          // Walk backwards
          for (let i = lenChatMessages - 1; i >= 0; i--) {
            const testChatMessageUUID = chatMessages[i].getUUID();
            if (testChatMessageUUID === chatMessageUUID) {
              return chatMessages[i];
            }
          }
        },

        /**
         * Updates an existing chat message with updated data.
         */
        [ACTION_UPDATE_CACHED_CHAT_MESSAGE_WITH_UUID]: (chatMessageUUID, updateHandler) => {
          if (typeof updateHandler !== 'function') {
            throw new Error('updateHandler is not a function');
          }

          let chatMessages = this.getState(STATE_CACHED_CHAT_MESSAGES);

          chatMessages = chatMessages.map(chatMessage => {
            const testChatMessageUUID = chatMessage.getUUID();

            if (testChatMessageUUID === chatMessageUUID) {
              // updateHandler must return the chatMessage
              chatMessage = updateHandler(chatMessage);
            }

            return chatMessage;
          });

          console.debug('updatedState', {
            chatMessages
          });

          this.setState({
            [STATE_CACHED_CHAT_MESSAGES]: chatMessages
          });
        }
      }
    });
  }

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