// import createSocketPeerReceivedReceiptDataPacket from 'utils/p2p/socket.io/createSocketPeerReceivedReceiptDataPacket';
// import sendSocketPeerDataPacket from 'utils/p2p/socket.io/sendSocketPeerDataPacket';
import {
  ACTION_GET_CACHED_CHAT_MESSAGE_WITH_UUID,
  ACTION_CACHE_CHAT_MESSAGE,
  ACTION_UPDATE_CACHED_CHAT_MESSAGE_WITH_UUID
} from 'state/P2PLinkedState';
import ChatMessage, { SOCKET_PEER_CHAT_MESSAGE_PACKET_TYPE } from '../ChatMessage';

const handleReceivedSocketPeerDataPacket = (p2pLinkedState, dataPacket) => {
  if (dataPacket.packetType === SOCKET_PEER_CHAT_MESSAGE_PACKET_TYPE) {

    const messageUUID = dataPacket.data.messageUUID;

    let chatMessage = p2pLinkedState.dispatchAction(ACTION_GET_CACHED_CHAT_MESSAGE_WITH_UUID, messageUUID);

    if (!chatMessage) {
      chatMessage = new ChatMessage(false, dataPacket.data.fromSocketPeerID, dataPacket.data.toSocketPeerID, dataPacket.data);

      // Add the chat message to the cache
      p2pLinkedState.dispatchAction(ACTION_CACHE_CHAT_MESSAGE, chatMessage);
    } else {
      // Manipulate existing

      p2pLinkedState.dispatchAction(ACTION_UPDATE_CACHED_CHAT_MESSAGE_WITH_UUID, messageUUID, (updatableChatMessage) => {
        updatableChatMessage.setSharedData(dataPacket.data);

        const updatedChatMessage = updatableChatMessage;

        return updatedChatMessage;
      });
    }
  }

  /*
  const { isReceivedReceiptRequested } = receivedData;

  p2pLinkedState.dispatchAction(ACTION_SET_LAST_RECEIVED_SOCKET_PEER_DATA_PACKET, receivedData);

  // Handle received receipt, if requested
  if (isReceivedReceiptRequested) {
    const {
      fromSocketPeerID: toSocketPeerID,
      packetUUID: originPacketUUID
    } = receivedData;

    // TODO: Create received receipt and return it
    const receivedReceiptDataPacket = createSocketPeerReceivedReceiptDataPacket(toSocketPeerID, originPacketUUID);

    console.debug('created received receipt data packet', receivedReceiptDataPacket);

    sendSocketPeerDataPacket(receivedReceiptDataPacket);
  }
  */
};

export default handleReceivedSocketPeerDataPacket;