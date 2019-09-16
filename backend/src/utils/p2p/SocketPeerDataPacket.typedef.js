/**
 * @typedef {Object} SocketPeerDataPacket
 * @property {SocketPeerDataPacketHeaders} headers
 * @property {string} packetType
 * @property {any} messageData
 * @property {boolean} isReceivedReceiptRequested
 */

 /**
  * @typedef {Object} SocketPeerDataPacketHeaders
  * @property {string} toSocketPeerID
  * @property {string} fromSocketPeerID
  * @property {string} packetUUID
  */