import 'shared/p2p/SocketPeerDataPacket.typedef';
import socketAPIQuery from 'utils/socketAPI/socketAPIQuery';
import { SOCKET_API_ROUTE_SEND_SOCKET_PEER_DATA } from 'shared/socketAPI/socketAPIRoutes';

/**
 * @param {SocketPeerDataPacket} socketPeerDataPacket
 */
const sendSocketPeerData = async (socketPeerDataPacket) => {
  try {
    const sendAck = await socketAPIQuery(SOCKET_API_ROUTE_SEND_SOCKET_PEER_DATA, socketPeerDataPacket);

    // TODO: Remove
    console.debug({
      sendAck
    });
  } catch (exc) {
    throw exc;
  }
};

export default sendSocketPeerData;