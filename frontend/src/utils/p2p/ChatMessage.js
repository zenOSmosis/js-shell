import EventEmitter from 'events';
import uuidv4 from 'uuidv4';
import { createSocketPeerDataPacket, sendSocketPeerDataPacket } from './socket.io';
import P2PLinkedState, {
  ACTION_GET_CACHED_CHAT_MESSAGE_WITH_UUID,
  ACTION_CACHE_CHAT_MESSAGE,
  ACTION_UPDATE_CACHED_CHAT_MESSAGE_WITH_UUID
} from 'state/P2PLinkedState';
import 'shared/p2p/SocketPeerDataPacket.typedef';

export const EVT_SHARED_UPDATE = 'update';

export const SOCKET_PEER_CHAT_MESSAGE_PACKET_TYPE = 'ChatMessage';

const commonP2PLinkedState = new P2PLinkedState();

class ChatMessage extends EventEmitter {
  /**
   * Handler for received SocketPeerDataPackets over the wire.
   * 
   * @param {SocketPeerDataPacket} dataPacket
   */
  static handleReceivedSocketPeerDataPacket(dataPacket) {
    const { data: sharedData } = dataPacket;
    const { messageUUID } = sharedData;

    let chatMessage = commonP2PLinkedState.dispatchAction(ACTION_GET_CACHED_CHAT_MESSAGE_WITH_UUID, messageUUID);

    if (!chatMessage) {
      chatMessage = ChatMessage.createFromSharedData(false, sharedData);
    } else {
      // Manipulate existing

      commonP2PLinkedState.dispatchAction(ACTION_UPDATE_CACHED_CHAT_MESSAGE_WITH_UUID, messageUUID, (updatableChatMessage) => {
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
   * @param {boolean} isFromLocal Whether the local peer originated the ChatMessage.
   * @param {Object} sharedData
   * @return {ChatMessage}
   */
  static createFromSharedData(isFromLocal, sharedData) {
    const { fromSocketPeerID, toSocketPeerID } = sharedData;

    const chatMessage = new ChatMessage(isFromLocal, fromSocketPeerID, toSocketPeerID, sharedData);

    // Add the chat message to the cache
    commonP2PLinkedState.dispatchAction(ACTION_CACHE_CHAT_MESSAGE, chatMessage);

    return chatMessage;
  };

  constructor(isFromLocal, fromSocketPeerID, toSocketPeerID, existingSharedData = null) {
    super();

    /**
     * Serialized data which can be viewed on both sides of the wire.
     */
    this._sharedData = existingSharedData || {
      fromSocketPeerID,
      toSocketPeerID,
      messageUUID: uuidv4(),
      isTyping: false,
      messageBody: null,
      isFinalized: false
    };

    /**
     * Serialized data which can only be viewed by the local user.
     */
    this._privateData = {
      isFromLocal,
      isSendingInProgress: false,
      isSent: false, // TODO: Dynamically determine when constructed
      receivedBySocketPeerIDs: [],
      readBySocketPeerIDs: []
    };

    // Non-serializable; direct class property
    this._isTypingTimeout = null;

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

      // Create new cached chat message and update it when EVT_SHARE_UPDATE is emitted
      if (!existingSharedData) {
        commonP2PLinkedState.dispatchAction(ACTION_CACHE_CHAT_MESSAGE, this);

        const messageUUID = this.getUUID();

        this.on(EVT_SHARED_UPDATE, () => {
          commonP2PLinkedState.dispatchAction(ACTION_UPDATE_CACHED_CHAT_MESSAGE_WITH_UUID, messageUUID, () => {
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
    const { isFromLocal } = this._privateData;

    return isFromLocal;
  }

  /**
   * @return {string}
   */
  getUUID() {
    const { messageUUID } = this._sharedData;

    return messageUUID;
  }

  async _createAndSendSharedDataPacket(isFinalizedMessage) {
    try {
      clearTimeout(this._emitPacketDebounceTimeout);

      if (!isFinalizedMessage && (this.getIsSendingInProgress() || this.getIsSent())) {
        console.warn('Blocked _createAndSendSharedDataPacket on already sent message.');
        return;
      }

      const toSocketPeerID = this.getToSocketPeerID();

      const dataPacket = createSocketPeerDataPacket(toSocketPeerID, SOCKET_PEER_CHAT_MESSAGE_PACKET_TYPE, this.getSharedData());
      await sendSocketPeerDataPacket(dataPacket);
    } catch (exc) {
      throw exc;
    }
  }

  getToSocketPeerID() {
    const { toSocketPeerID } = this._sharedData;

    return toSocketPeerID;
  }

  getFromSocketPeerID() {
    const { fromSocketPeerID } = this._sharedData;

    return fromSocketPeerID;
  }

  // TODO: Block this if not from local
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

  setSharedData(params) {
    this._sharedData = { ...this._sharedData, ...params };

    this.emit(EVT_SHARED_UPDATE);
  }

  /**
   * @return {Object}
   */
  getSharedData() {
    return this._sharedData;
  }

  /**
   * @return {boolean}
   */
  getIsFinalized() {
    const { isFinalized } = this.getSharedData();

    return { isFinalized };
  }

  _setPrivateData(params) {
    this._privateData = { ...this._privateData, ...params };
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

  getIsTyping() {
    const { isTyping } = this._sharedData;
    return isTyping;
  }

  setMessageBody(messageBody) {
    this.setSharedData({
      messageBody
    });
  }

  /**
   * @return {string}
   */
  getMessageBody() {
    const { messageBody } = this._sharedData;

    return messageBody;
  }

  // TODO: Block this if not from local
  _setIsFinalized(isFinalized) {
    this.setSharedData({
      isFinalized
    });
  }

  /**
   * @return {boolean}
   */
  getIsFinalized() {
    const { isFinalized } = this._sharedData;

    return isFinalized;
  }

  // TODO: Block this if not from local
  _setIsSendingInProgress(isSendingInProgress) {
    this._setPrivateData({
      isSendingInProgress
    });
  }

  /**
   * @return {boolean}
   */
  getIsSendingInProgress() {
    const { isSendingInProgress } = this._privateData;

    return isSendingInProgress;
  }

  // TODO: Block this if not from local
  _setIsSent(isSent) {
    this._setPrivateData({
      isSent
    });
  }

  /**
   * @return {boolean}
   */
  getIsSent() {
    const { isSent } = this._privateData;

    return isSent;
  }

  addReadBySocketPeerID(socketPeerID) {
    const { readBySocketPeerIDs } = this._privateData;

    readBySocketPeerIDs.push(socketPeerID);

    this._setPrivateData({
      readBySocketPeerIDs
    });
  }

  getReadBySocketPeerIDs() {
    const { readBySocketPeerIDs } = this._privateData;

    return readBySocketPeerIDs;
  }

  addReceivedBySocketPeerID(socketPeerID) {
    const { receivedBySocketPeerIDs } = this._privateData;

    receivedBySocketPeerIDs.push(socketPeerID);

    this._setPrivateData({
      receivedBySocketPeerIDs
    });
  }

  getReceivedBySocketPeerIDs() {
    const { receivedBySocketPeerIDs } = this._privateData;

    return receivedBySocketPeerIDs;
  }
}

export default ChatMessage;