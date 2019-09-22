import 'shared/p2p/SocketPeerDataPacket.typedef';
import uuidv4 from 'uuidv4';
import { getSocketId } from 'utils/socket.io';

/**
 * Creates a new data packet to be utilized for sending a message to another
 * SocketPeer connection.
 * 
 * IMPORTANT! This requires the usage of sendSocketPeerDataPacket in order to
 * transmit.
 * 
 * @param {string} toSocketPeerId 
 * @param {any} messageData 
 * @param {boolean} isReceivedReceiptRequested
 * 
 * @return {SocketPeerDataPacket} 
 */
const createSocketPeerDataPacket = (toSocketPeerId, packetType, data, isReceivedReceiptRequested = false) => {
  const fromSocketPeerId = getSocketId();

  if (!fromSocketPeerId) {
    throw new Error('Socket is not connected. Cannot create a new Socket Peer data packet.');
  }
  
  // A unique identifier for this data packet
  const packetUuid = uuidv4();

  return {
    toSocketPeerId,
    fromSocketPeerId,
    packetUuid,
    packetType,
    data,
    isReceivedReceiptRequested
  };
};

export default createSocketPeerDataPacket;