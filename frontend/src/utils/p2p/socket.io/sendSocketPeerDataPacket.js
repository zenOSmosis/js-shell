import 'shared/p2p/SocketPeerDataPacket.typedef';
import socketAPIQuery from 'utils/socketAPI/socketAPIQuery';
import { SOCKET_API_ROUTE_SEND_SOCKET_PEER_DATA } from 'shared/socketAPI/socketAPIRoutes';

/**
 * @param {SocketPeerDataPacket} socketPeerDataPacket
 */
const sendSocketPeerData = async (socketPeerDataPacket) => {
  try {
      /*
      const {
        toSocketPeerID,
        fromSocketPeerID,
        uuid,
        data,
        body,
        isReceivedReceiptRequested
      } = socketPeerDataPacket;
      */

    const sendAck = await socketAPIQuery(SOCKET_API_ROUTE_SEND_SOCKET_PEER_DATA, socketPeerDataPacket);

    console.debug({
      sendAck
    });
  } catch (exc) {
    throw exc;
  }
};

export default sendSocketPeerData;