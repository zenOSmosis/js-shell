import 'shared/p2p/SocketPeerDataPacket.typedef';
import socketAPIQuery from 'utils/socketAPI/socketAPIQuery';
import { SOCKET_API_ROUTE_SEND_SOCKET_PEER_DATA } from 'shared/socketAPI/socketAPIRoutes';

/**
 * @param {SocketPeerDataPacket} socketPeerDataPacket
 */
const sendSocketPeerData = (socketPeerDataPacket) => {
  console.warn('TODO: Implment sending of socketPeerDataPacket', {
    'UNVERIFIED_FORMAT': socketPeerDataPacket
  });

  /*
  const {
    toSocketPeerID,
    fromSocketPeerID,
    uuid,
    data,
    body,
    isReadReceiptRequested
  } = socketPeerDataPacket;
  */

  const sendAck = socketAPIQuery(SOCKET_API_ROUTE_SEND_SOCKET_PEER_DATA, socketPeerDataPacket);

  console.debug({
    sendAck
  });
};

export default sendSocketPeerData;