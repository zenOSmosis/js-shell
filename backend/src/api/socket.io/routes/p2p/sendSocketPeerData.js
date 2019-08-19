const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');
require('utils/p2p/SocketPeerDataPacket.typedef');

/**
 * 
 * @param {SocketPeerDataPacket} socketPeerDataPacket 
 * @param {function} ack 
 */
const sendSocketPeerData = async (socketPeerDataPacket, ack) => {
  return await handleSocketAPIRoute(() => {
    const {
      toSocketPeerID,
      fromSocketPeerID,
      uuid,
      data,
      body,
      isReadReceiptRequested
    } = socketPeerDataPacket;

    console.log(socketPeerDataPacket);

    // Validate other user is online

    // Emit data / body

    // Handle read receipt
  }, ack);
};

module.exports = sendSocketPeerData;