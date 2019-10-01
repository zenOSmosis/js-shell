import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';
import dbSetUserData from 'utils/mongo/collections/users/setUserData';
import broadcast from 'utils/p2p/broadcast';
import { SOCKET_API_EVT_PEER_DETAIL } from '../../events';

const setUserData = async (userData, socket, ack) => {
  return await handleSocketAPIRoute(async () => {
    try {
      const sharedData = await dbSetUserData(userData, socket);

      // Broadcast sharedData to all other peers
      broadcast(socket, SOCKET_API_EVT_PEER_DETAIL, sharedData);
    } catch (exc) {
      throw exc;
    }
  }, ack);
};

export default setUserData;