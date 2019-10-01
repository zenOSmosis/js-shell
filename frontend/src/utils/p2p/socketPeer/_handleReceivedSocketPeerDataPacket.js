import ChatMessage, { SOCKET_PEER_CHAT_MESSAGE_PACKET_TYPE } from '../ChatMessage.class';
import { WebRTCPeer, SOCKET_PEER_WEB_RTC_SIGNAL_PACKET_TYPE } from '../webRTC';

/**
 * Internally called when the client has received a SocketPeerDataPacket from
 * a remote peer.
 * 
 * @param {SocketPeerDataPacket} dataPacket 
 */
const _handleReceivedSocketPeerDataPacket = (dataPacket) => {
  const { packetType } = dataPacket;

  switch (packetType) {
    case SOCKET_PEER_CHAT_MESSAGE_PACKET_TYPE:
      ChatMessage.handleReceivedSocketPeerDataPacket(dataPacket);
      break;

    case SOCKET_PEER_WEB_RTC_SIGNAL_PACKET_TYPE:
      WebRTCPeer.handleReceivedSignalDataPacket(dataPacket);
      break;

    default:
      console.warn(`Unhandled SocketPeer packet type: ${packetType}`);
      break;
  }

  // TODO: Work on old implemenation for sending received receipts
  /*
  const { isReceivedReceiptRequested } = receivedData;

  p2pLinkedState.dispatchAction(ACTION_SET_LAST_RECEIVED_SOCKET_PEER_DATA_PACKET, receivedData);

  // Handle received receipt, if requested
  if (isReceivedReceiptRequested) {
    const {
      fromPeerId: toPeerId,
      packetUuid: originPacketUuid
    } = receivedData;

    // TODO: Create received receipt and return it
    const receivedReceiptDataPacket = createSocketPeerReceivedReceiptDataPacket(toPeerId, originPacketUuid);

    console.debug('created received receipt data packet', receivedReceiptDataPacket);

    sendSocketPeerDataPacket(receivedReceiptDataPacket);
  }
  */
};

export default _handleReceivedSocketPeerDataPacket;