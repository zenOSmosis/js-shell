import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';
import { getSocketID } from 'utils/socket.io';

export {
  EVT_LINKED_STATE_UPDATE
};

export const P2P_LINKED_STATE_SCOPE_NAME = 'p2pConnections';

export const STATE_SOCKET_PEER_IDS = 'socketPeerIDs';
export const STATE_WEBRTC_CONNECTIONS = 'webRTCConnections';
export const STATE_LAST_RECEIVED_SOCKET_PEER_DATA_PACKET = 'lastReceivedPeerDataPacket';
export const STATE_CACHED_DATA_PACKETS = 'cachedDataPackets';

export const ACTION_SET_LAST_RECEIVED_SOCKET_PEER_DATA_PACKET = 'handleReceivedSocketPeerDataPacket';
export const ACTION_UPDATE_CACHED_DATA_PACKET_WITH_UUID = 'updateCachedDataPacketWithUUID';
export const ACTION_CACHE_DATA_PACKET = 'cacheDataPacket';
export const ACTION_GET_CACHED_DATA_PACKETS = 'getCachedDataPackets';

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

      [STATE_LAST_RECEIVED_SOCKET_PEER_DATA_PACKET]: {},

      [STATE_CACHED_DATA_PACKETS]: []
    }, {
      actions: {
        // Called via P2PMonitor when there is received SocketPeer data
        [ACTION_SET_LAST_RECEIVED_SOCKET_PEER_DATA_PACKET]: (receivedData) => {
          this.setState({
            [STATE_LAST_RECEIVED_SOCKET_PEER_DATA_PACKET]: receivedData
          });
        },

        // Adds a chat message to the log
        // This should only be called by the ChatManager app
        [ACTION_CACHE_DATA_PACKET]: (chatMessage) => {
          if (!chatMessage) {
            console.warn('chatMessage does not exist');
            return;
          }

          const currentChatMessages = this.getState(STATE_CACHED_DATA_PACKETS);

          currentChatMessages.push(chatMessage);

          this.setState({
            [STATE_CACHED_DATA_PACKETS]: currentChatMessages
          });
        },

        [ACTION_GET_CACHED_DATA_PACKETS]: (withFilter = null) => {
          let chatMessages = this.getState(STATE_CACHED_DATA_PACKETS);

          if (typeof withFilter === 'function') {
            chatMessages = chatMessages.filter(withFilter);
          }

          return chatMessages;
        },

        /**
         * Updates an existing chat message with updated data.
         */
        [ACTION_UPDATE_CACHED_DATA_PACKET_WITH_UUID]: (packetUUID, updatedData) => {
          let chatMessages = this.getState(STATE_CACHED_DATA_PACKETS);

          chatMessages = chatMessages.map(chatMessage => {
            const { headers } = chatMessage;
            const { packetUUID: testPacketUUID } = headers;

            if (testPacketUUID !== packetUUID) {
              return chatMessage;
            } else {
              chatMessage = {...chatMessage, ...{updatedData}};

              return chatMessage;
            }
          });

          this.setState({
            [STATE_CACHED_DATA_PACKETS]: chatMessages
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