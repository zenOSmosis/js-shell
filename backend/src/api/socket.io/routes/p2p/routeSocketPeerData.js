import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';
import 'utils/p2p/SocketPeerDataPacket.typedef';
import { SOCKET_API_EVT_PEER_DATA } from '../../events';
import { fetchUserSocketId } from 'utils/mongo/collections/users';

/**
 * @param {Socket} socket
 * @param {SocketPeerDataPacket} socketPeerDataPacket
 * @param {function} ack 
 */
const routeSocketPeerData = async (socket, socketPeerDataPacket, ack) => {
  return await handleSocketAPIRoute(async () => {
    try {
      const { toPeerId } = socketPeerDataPacket;
  
      if (!toPeerId) {
        throw new Error('No toPeerId set');
      }

      // Obtain socket id for the to peer
      const toSocketId = await fetchUserSocketId(toPeerId);
  
      // TODO: Handle routed event ack (it's not avialable on broadcast)
      socket.to(toSocketId).emit(SOCKET_API_EVT_PEER_DATA, socketPeerDataPacket);
    } catch (exc) {
      throw exc;
    }
  }, ack);
};

export default routeSocketPeerData;