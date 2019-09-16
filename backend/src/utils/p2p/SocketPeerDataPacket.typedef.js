/**
 * @typedef {Object} SocketPeerDataPacket
 * @property {SocketPeerDataPacketHeaders} headers
 * @property {any} messageData
 * @property {boolean} isReceivedReceiptRequested
 */

 /**
  * @typedef {Object} SocketPeerDataPacketHeaders
  * @property {string} toSocketPeerID
  * @property {string} fromSocketPeerID
  * @property {string} packetUUID
  */