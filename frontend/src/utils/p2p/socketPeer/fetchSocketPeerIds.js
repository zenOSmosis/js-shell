import socketAPIQuery from 'utils/socketAPI/socketAPIQuery';
import { SOCKET_API_ROUTE_FETCH_SOCKET_IDS } from 'shared/socketAPI/socketAPIRoutes';

/**
 * Retrieves Socket.io Ids of remote peers, connected to the server.
 * 
 * IMPORTANT!  This iteration is not very scalable and WILL result in low
 * performance, and/or crashing if a lot of peers are connected remotely.
 * 
 * @return {Promise<string[]>}
 */
const fetchSocketPeerIds = async () => {
  try {
    const socketPeerIds = await socketAPIQuery(SOCKET_API_ROUTE_FETCH_SOCKET_IDS);

    return socketPeerIds;
  } catch (exc) {
    throw exc;
  }
};

export default fetchSocketPeerIds;