import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';
import 'utils/p2p/SocketPeerDataPacket.typedef';
import { SOCKET_API_EVT_PEER_DATA } from '../../events';

/**
 * @typedef {Object} RouteSocketPeerDataBundle
 * @property {Object} socket
 * @property {SocketPeerDataPacket} socketPeerDataPacket
 */

/**
 * @param {RouteSocketPeerDataBundle} dataBundle 
 * @param {function} ack 
 */
const routeSocketPeerData = async (dataBundle, ack) => {
  return await handleSocketAPIRoute(() => {
    const { socket, socketPeerDataPacket } = dataBundle;

    const { toSocketPeerId } = socketPeerDataPacket;

    if (!toSocketPeerId) {
      throw new Error('No toSocketPeerId set');
    }

    // TODO: Handle emit ack
    socket.to(toSocketPeerId).emit(SOCKET_API_EVT_PEER_DATA, socketPeerDataPacket);
  }, ack);
};

export default routeSocketPeerData;