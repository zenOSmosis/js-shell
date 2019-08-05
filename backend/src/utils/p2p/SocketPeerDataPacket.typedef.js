/**
 * @typedef {Object} SocketPeerDataPacket
 * @property {SocketPeerDataPacketHeaders} headers
 * @property {any} data
 * @property {any} body
 * @property {boolean} isReadReceiptRequested
 */

 /**
  * @typedef {Object} SocketPeerDataPacketHeaders
  * @property {string} toSocketPeerID
  * @property {string} fromSocketPeerID
  * @property {string} uuid
  */