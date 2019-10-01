import ChatMessage, { SOCKET_PEER_CHAT_MESSAGE_PACKET_TYPE } from '../ChatMessage.class';
import WebRTCPeer, { SOCKET_PEER_WEB_RTC_SIGNAL_PACKET_TYPE } from '../WebRTCPeer.class';

/**
 * Internally called when the client has received a SocketPeerDataPacket from
 * a remote peer.
 * 
 * @param {SocketPeerDataPacket} dataPacket 
 */
const _routeReceivedSocketPeerDataPacket = (dataPacket) => {
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
};

export default _routeReceivedSocketPeerDataPacket;