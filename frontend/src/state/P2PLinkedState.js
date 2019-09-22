import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';
import { getSocketId } from 'utils/socket.io';

export {
  EVT_LINKED_STATE_UPDATE
};

export const P2P_LINKED_STATE_SCOPE_NAME = 'p2pConnections';

export const STATE_SOCKET_PEER_IDS = 'socketPeerIds';
export const STATE_WEBRTC_CONNECTIONS = 'webRTCConnections';
export const STATE_CACHED_CHAT_MESSAGES = 'cachedChatMessages';
export const STATE_LOCAL_PEER = 'localPeer';
export const STATE_REMOTE_PEERS = 'remotePeers';

export const ACTION_CACHE_CHAT_MESSAGE = 'cacheChatMessage';
export const ACTION_GET_CACHED_CHAT_MESSAGES = 'getCachedChatMessages';
export const ACTION_GET_CACHED_CHAT_MESSAGE_WITH_UUID = 'getCachedChatMessageWithUuid';
export const ACTION_UPDATE_CACHED_CHAT_MESSAGE_WITH_UUID = 'updateCachedChatMessageWithUuid';
export const ACTION_SET_LOCAL_PEER = 'setLocalPeer';
export const ACTION_SET_REMOTE_PEERS = 'setRemotePeers';

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
      [STATE_CACHED_CHAT_MESSAGES]: [],

      [STATE_LOCAL_PEER]: null,
      [STATE_REMOTE_PEERS]: []
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
        },

        [ACTION_SET_LOCAL_PEER]: (localPeer) => {
          this.setState({
            [STATE_LOCAL_PEER]: localPeer
          });
        },

        [ACTION_SET_REMOTE_PEERS]: (remotePeers) => {
          this.setState({
            [STATE_REMOTE_PEERS]: remotePeers
          });
        }
      }
    });
  }

  setSocketPeerIds(socketPeerIds = []) {
    if (!Array.isArray(socketPeerIds)) {
      throw new Error('socketPeerIds is not an array');
    }

    // Filter out local Id from peer Ids
    const socketId = getSocketId();
    socketPeerIds = socketPeerIds.filter(socketPeerId => {
      return socketPeerId !== socketId;
    });

    this.setState({
      [STATE_SOCKET_PEER_IDS]: socketPeerIds
    });
  }

  /** 
   * @param {number} socketPeerId 
   */
  addSocketPeerId(socketPeerId) {
    const { [STATE_SOCKET_PEER_IDS]: socketPeerIds } = this.getState();

    socketPeerIds.push(socketPeerId);

    this.setState({
      [STATE_SOCKET_PEER_IDS]: socketPeerIds
    });
  }

  /**
   * @param {number} socketPeerId 
   */
  removeSocketPeerId(socketPeerId) {
    const { [STATE_SOCKET_PEER_IDS]: socketPeerIds } = this.getState();

    const rmIdx = socketPeerIds.indexOf(socketPeerId);

    if (rmIdx > -1) {
      socketPeerIds.splice(rmIdx, 1);

      this.setState({
        [STATE_SOCKET_PEER_IDS]: socketPeerIds
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