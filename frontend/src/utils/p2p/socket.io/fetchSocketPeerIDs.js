import socketAPIQuery from 'utils/socketAPI/socketAPIQuery';
import { SOCKET_API_ROUTE_FETCH_SOCKET_IDS } from 'shared/socketAPI/socketAPIRoutes';

/**
 * Retrieves socket IDs of remote peers, connected to the server.
 * 
 * IMPORTANT!  This iteration is not very scalable and WILL result in low
 * performance, and/or crashing if a lot of peers are connected remotely.
 * 
 * @return {Promise<string[]>}
 */
const fetchSocketPeerIDs = async () => {
  try {
    const socketPeerIDs = await socketAPIQuery(SOCKET_API_ROUTE_FETCH_SOCKET_IDS);

    return socketPeerIDs;
  } catch (exc) {
    throw exc;
  }
};

export default fetchSocketPeerIDs;