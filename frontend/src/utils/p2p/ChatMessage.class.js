import P2PSharedObject, { EVT_SHARED_UPDATE } from './P2PSharedObject.class';
import uuidv4 from 'uuidv4';
import { createSocketPeerDataPacket, sendSocketPeerDataPacket } from './socketPeer';
import P2PLinkedState, {
  ACTION_GET_CACHED_CHAT_MESSAGE_WITH_UUID,
  ACTION_CACHE_CHAT_MESSAGE,
  ACTION_UPDATE_CACHED_CHAT_MESSAGE_WITH_UUID
} from 'state/P2PLinkedState';
import 'shared/p2p/SocketPeerDataPacket.typedef';
import { getLocalPeerId } from './Peer.class';

export { EVT_SHARED_UPDATE };

export const SOCKET_PEER_CHAT_MESSAGE_PACKET_TYPE = 'ChatMessage';

export const PRIVATE_DATA_KEY_IS_FROM_LOCAL = 'isFromLocal';
export const PRIVATE_DATA_KEY_IS_SENDING_IN_PROGRESS = 'isSendingInProgress';
export const PRIVATE_DATA_KEY_IS_SENT = 'isSent';
export const PRIVATE_DATA_KEY_RECEIVED_BY_SOCKET_PEER_IDS = 'receivedByPeerIds';
export const PRIVATE_DATA_KEY_READ_BY_SOCKET_PEER_IDS = 'readByPeerIds';

export const SHARED_DATA_KEY_FROM_SOCKET_PEER_ID = 'fromPeerId';
export const SHARED_DATA_KEY_TO_SOCKET_PEER_ID = 'toPeerId';
export const SHARED_DATA_KEY_MESSAGE_UUID = 'messageUuid';
export const SHARED_DATA_KEY_IS_TYPING = 'isTyping';
export const SHARED_DATA_KEY_MESSAGE_BODY = 'messageBody';
export const SHARED_DATA_KEY_IS_FINALIZED = 'isFinalized';

const commonP2PLinkedState = new P2PLinkedState();

class ChatMessage extends P2PSharedObject {
  /**
   * Handler for received SocketPeerDataPackets over the wire.
   * 
   * @param {SocketPeerDataPacket} dataPacket
   */
  static handleReceivedSocketPeerDataPacket(dataPacket) {
    const { data: sharedData } = dataPacket;
    const { messageUuid } = sharedData;

    let chatMessage = commonP2PLinkedState.dispatchAction(ACTION_GET_CACHED_CHAT_MESSAGE_WITH_UUID, messageUuid);

    if (!chatMessage) {
      chatMessage = ChatMessage.createFromSharedData(false, sharedData);
    } else {
      // Manipulate existing

      commonP2PLinkedState.dispatchAction(ACTION_UPDATE_CACHED_CHAT_MESSAGE_WITH_UUID, messageUuid, (updatableChatMessage) => {
        updatableChatMessage.setSharedData(sharedData);

        const updatedChatMessage = updatableChatMessage;

        return updatedChatMessage;
      });
    }
  };

  /**
   * Creates a new ChatMessage instance from the given sharedData and registers
   * it w/ P2PLinkedState.
   * 
   * @param {boolean} isFromLocal Whether the local peer originated the
   * ChatMessage.
   * @param {Object} sharedData
   * @return {ChatMessage}
   */
  static createFromSharedData(isFromLocal, sharedData) {
    const { fromPeerId, toPeerId } = sharedData;

    const chatMessage = new ChatMessage(isFromLocal, toPeerId, fromPeerId, sharedData);

    return chatMessage;
  };

  // TODO: Remove isFromLocal (can be determined from localPeerId)
  constructor(isFromLocal, toPeerId, fromPeerId = null, existingSharedData = null) {
    const initialSharedData = existingSharedData || {
      [SHARED_DATA_KEY_FROM_SOCKET_PEER_ID]: (fromPeerId ? fromPeerId : getLocalPeerId()),
      [SHARED_DATA_KEY_TO_SOCKET_PEER_ID]: toPeerId,
      [SHARED_DATA_KEY_MESSAGE_UUID]: uuidv4(),
      [SHARED_DATA_KEY_IS_TYPING]: false,
      [SHARED_DATA_KEY_MESSAGE_BODY]: null,
      [SHARED_DATA_KEY_IS_FINALIZED]: false
    };

    const initialPrivateData = {
      [PRIVATE_DATA_KEY_IS_FROM_LOCAL]: isFromLocal,
      [PRIVATE_DATA_KEY_IS_SENDING_IN_PROGRESS]: false,
      [PRIVATE_DATA_KEY_IS_SENT]: false, // TODO: Dynamically determine when constructed
      [PRIVATE_DATA_KEY_RECEIVED_BY_SOCKET_PEER_IDS]: [],
      [PRIVATE_DATA_KEY_READ_BY_SOCKET_PEER_IDS]: []
    };

    super(initialSharedData, initialPrivateData);

    // Non-serializable; direct class property
    this._isTypingTimeout = null;

    // Add the message to the state store
    commonP2PLinkedState.dispatchAction(ACTION_CACHE_CHAT_MESSAGE, this);

    if (isFromLocal) {
      // Send sharedData across the wire when EVT_SHARED_UPDATE is emitted
      (() => {
        let _emitPacketTimeout = null;

        this.on(EVT_SHARED_UPDATE, () => {
          clearTimeout(_emitPacketTimeout);

          _emitPacketTimeout = setTimeout(() => {
            this._createAndSendSharedDataPacket();
          }, 1);
        });
      })();

      // Create new cached chat message and update it when EVT_SHARED_UPDATE is emitted
      if (!existingSharedData) {
        const messageUuid = this.getUuid();

        this.on(EVT_SHARED_UPDATE, () => {
          commonP2PLinkedState.dispatchAction(ACTION_UPDATE_CACHED_CHAT_MESSAGE_WITH_UUID, messageUuid, () => {
            return this;
          });
        });
      }

      // Send initial data packet indicating new message if not already finalized
      if (!this.getIsFinalized()) {
        this.emit(EVT_SHARED_UPDATE);
      }
    }
  }

  /**
   * @return {boolean}
   */
  getIsFromLocal() {
    const { [PRIVATE_DATA_KEY_IS_FROM_LOCAL]: isFromLocal } = this._privateData;

    return isFromLocal;
  }

  /**
   * @return {string}
   */
  getUuid() {
    const { [SHARED_DATA_KEY_MESSAGE_UUID]: messageUuid } = this._sharedData;

    return messageUuid;
  }

  /**
   * 
   * @param {boolean} isFinalizedMessage 
   */
  async _createAndSendSharedDataPacket(isFinalizedMessage) {
    try {
      clearTimeout(this._emitPacketDebounceTimeout);

      if (!isFinalizedMessage && (this.getIsSendingInProgress() || this.getIsSent())) {
        console.warn('Blocked _createAndSendSharedDataPacket on already sent message.');
        return;
      }

      const toPeerId = this.getToPeerId();

      const dataPacket = createSocketPeerDataPacket(toPeerId, SOCKET_PEER_CHAT_MESSAGE_PACKET_TYPE, this.getSharedData());
      await sendSocketPeerDataPacket(dataPacket);
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * @return {string}
   */
  getToPeerId() {
    const { [SHARED_DATA_KEY_TO_SOCKET_PEER_ID]: toPeerId } = this._sharedData;

    return toPeerId;
  }

  /**
   * @return {string}
   */
  getFromPeerId() {
    const { [SHARED_DATA_KEY_FROM_SOCKET_PEER_ID]: fromPeerId } = this._sharedData;

    return fromPeerId;
  }

  // TODO: Block this if not from local
  /**
   * 
   * @param {string} messageBody 
   */
  async finalizeAndSendMessage(messageBody) {
    try {
      this.setIsTyping(false);
      this._setIsFinalized(true);
      this.setMessageBody(messageBody);
      this._setIsSendingInProgress(true);

      await this._createAndSendSharedDataPacket(true);

      this._setIsSendingInProgress(false);
      this._setIsSent(true);
    } catch (exc) {
      this._setIsSendingInProgress(false);

      throw exc;
    }
  }

  /**
   * Note: This interally will set itself to false after the _isTypingTimeout
   * interval has passed.
   * 
   * Each time setIsTyping() is passed a true value, it reinstates the
   * _isTypingTimeout interval. 
   * 
   * @param {boolean} isTyping 
   */
  setIsTyping(isTyping) {
    if (isTyping !== this.getIsTyping()) {
      this.setSharedData({
        isTyping
      });
    }

    clearTimeout(this._isTypingTimeout);

    if (isTyping) {
      this._isTypingTimeout = setTimeout(() => {
        this.setIsTyping(false)
      }, 1000);
    }
  }

  /**
   * @return {boolean}
   */
  getIsTyping() {
    const { [SHARED_DATA_KEY_IS_TYPING]: isTyping } = this._sharedData;
    return isTyping;
  }

  // TODO: Block if finalized
  /**
   * @param {string} messageBody 
   */
  setMessageBody(messageBody) {
    this.setSharedData({
      messageBody
    });
  }

  /**
   * @return {string}
   */
  getMessageBody() {
    const { [SHARED_DATA_KEY_MESSAGE_BODY]: messageBody } = this._sharedData;

    return messageBody;
  }

  // TODO: Block this if not from local
  /**
   * @param {string} isFinalized 
   */
  _setIsFinalized(isFinalized) {
    this.setSharedData({
      isFinalized
    });
  }

  /**
   * @return {boolean}
   */
  getIsFinalized() {
    const { [SHARED_DATA_KEY_IS_FINALIZED]: isFinalized } = this._sharedData;

    return isFinalized;
  }

  // TODO: Block this if not from local
  /**
   * 
   * @param {boolean} isSendingInProgress 
   */
  _setIsSendingInProgress(isSendingInProgress) {
    this._setPrivateData({
      isSendingInProgress
    });
  }

  /**
   * @return {boolean}
   */
  getIsSendingInProgress() {
    const { [PRIVATE_DATA_KEY_IS_SENDING_IN_PROGRESS]: isSendingInProgress } = this._privateData;

    return isSendingInProgress;
  }

  // TODO: Block this if not from local
  /**
   * 
   * @param {boolean} isSent 
   */
  _setIsSent(isSent) {
    this._setPrivateData({
      isSent
    });
  }

  /**
   * @return {boolean}
   */
  getIsSent() {
    const { [PRIVATE_DATA_KEY_IS_SENT]: isSent } = this._privateData;

    return isSent;
  }

  /**
   * 
   * @param {string} socketPeerId 
   */
  addReadByPeerId(socketPeerId) {
    const { [PRIVATE_DATA_KEY_READ_BY_SOCKET_PEER_IDS]: readByPeerIds } = this._privateData;

    readByPeerIds.push(socketPeerId);

    this._setPrivateData({
      readByPeerIds
    });
  }

  /**
   * @return {string[]}
   */
  getReadByPeerIds() {
    const { [PRIVATE_DATA_KEY_READ_BY_SOCKET_PEER_IDS]: readByPeerIds } = this._privateData;

    return readByPeerIds;
  }

  /**
   * @param {string} socketPeerId 
   */
  addReceivedByPeerId(socketPeerId) {
    const { [PRIVATE_DATA_KEY_RECEIVED_BY_SOCKET_PEER_IDS]: receivedByPeerIds } = this._privateData;

    receivedByPeerIds.push(socketPeerId);

    this._setPrivateData({
      receivedByPeerIds
    });
  }

  /**
   * @return {string[]}
   */
  getReceivedByPeerIds() {
    const { [PRIVATE_DATA_KEY_RECEIVED_BY_SOCKET_PEER_IDS]: receivedByPeerIds } = this._privateData;

    return receivedByPeerIds;
  }
}

export default ChatMessage;