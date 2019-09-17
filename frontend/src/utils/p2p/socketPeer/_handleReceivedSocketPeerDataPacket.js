// import createSocketPeerReceivedReceiptDataPacket from 'utils/p2p/socket.io/createSocketPeerReceivedReceiptDataPacket';
// import sendSocketPeerDataPacket from 'utils/p2p/socket.io/sendSocketPeerDataPacket';

import ChatMessage, { SOCKET_PEER_CHAT_MESSAGE_PACKET_TYPE } from '../ChatMessage';

const _handleReceivedSocketPeerDataPacket = (dataPacket) => {
  const { packetType } = dataPacket;

  switch (packetType) {
    case SOCKET_PEER_CHAT_MESSAGE_PACKET_TYPE:
      ChatMessage.handleReceivedSocketPeerDataPacket(dataPacket);
      break;

    default:
      console.warn(`Unhandled SocketPeer packet type: ${packetType}`);
      break;
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

export default _handleReceivedSocketPeerDataPacket;