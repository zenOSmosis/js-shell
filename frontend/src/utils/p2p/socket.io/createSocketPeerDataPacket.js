import 'shared/p2p/SocketPeerDataPacket.typedef';
import uuidv4 from 'uuidv4';
import { getSocketID } from 'utils/socket.io';

/**
 * Creates a new data packet to be utilized for sending a message to another Socket Peer connection.
 * 
 * @param {string} toSocketPeerID 
 * @param {any} messageData 
 * @param {boolean} isReceivedReceiptRequested
 * 
 * @return {SocketPeerDataPacket} 
 */
const createSocketPeerDataPacket = (toSocketPeerID, messageData, isReceivedReceiptRequested = false) => {
  const fromSocketID = getSocketID();

  if (!fromSocketID) {
    throw new Error('Socket is not connected. Cannot create a new Socket Peer data packet.');
  }
  
  const packetUUID = uuidv4();

  return {
    headers: {
      toSocketPeerID,
      fromSocketID,
      packetUUID
    },
    messageData,
    isReceivedReceiptRequested
  };
};

export default createSocketPeerDataPacket;