import socketAPIQuery from 'utils/socketAPI/socketAPIQuery';
import { SOCKET_API_ROUTE_FETCH_CONNECTED_USERS } from 'shared/socketAPI/socketAPIRoutes';
import Peer from '../Peer.class';

/**
 * @return {Peer[]}
 */
const fetchConnectedPeers = async () => {
  try {
    const rawUsers = await socketAPIQuery(SOCKET_API_ROUTE_FETCH_CONNECTED_USERS);
    const lenConnectedUsers = rawUsers.length;

    // Map raw users to Peer instances
    const connectedPeers = [];
    for (let i = 0; i < lenConnectedUsers; i++) {
      const peer = Peer.createFromRawData(rawUsers[i]);

      connectedPeers.push(peer);
    }

    return connectedPeers;
  } catch (exc) {
    throw exc;
  }
};

export default fetchConnectedPeers;