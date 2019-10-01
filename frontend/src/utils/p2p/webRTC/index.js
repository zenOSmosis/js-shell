import WebRTCPeer, { SOCKET_PEER_WEB_RTC_SIGNAL_PACKET_TYPE } from './WebRTCPeer.class';

const initiateConnection = (remotePeer, mediaStream = null) => {
  return WebRTCPeer.initiateConnection(remotePeer, mediaStream);
};

const disconnectConnection = (remotePeer) => {
  return WebRTCPeer.disconnectConnection(remotePeer);
};

export {
  SOCKET_PEER_WEB_RTC_SIGNAL_PACKET_TYPE,

  WebRTCPeer,
  initiateConnection,
  disconnectConnection
};