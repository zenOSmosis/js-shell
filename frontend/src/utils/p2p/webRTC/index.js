import WebRTCPeer, { SOCKET_PEER_WEB_RTC_SIGNAL_PACKET_TYPE } from './WebRTCPeer.class';

const initiateWebRTCConnection = (remotePeer, mediaStream = null) => {
  return WebRTCPeer.initiateConnection(remotePeer, mediaStream);
};

export {
  SOCKET_PEER_WEB_RTC_SIGNAL_PACKET_TYPE,

  WebRTCPeer,
  initiateWebRTCConnection
};