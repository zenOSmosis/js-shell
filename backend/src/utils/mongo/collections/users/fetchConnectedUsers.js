import fetchUsersCollection from './fetchUsersCollection';
import fetchConnectedSocketIds from 'utils/socketIO/fetchConnectedSocketIds';
import { objPropsSnakeCaseToCamelCase } from '../../converters';

/**
 * @param {string} ignoreSocketId? Socket.io id to ignore.
 * @return {Promise<Object[]>}
 */
const fetchConnectedUsers = async (ignoreSocketId = null) => {
  try {
    const connectedSocketIds = await fetchConnectedSocketIds();

    if (ignoreSocketId) {
      const idxIgnoredId = connectedSocketIds.indexOf(ignoreSocketId);
      connectedSocketIds.splice(idxIgnoredId, 1);
    }

    const usersCollection = await fetchUsersCollection();
    
    let connectedUsers = await usersCollection.find({
      socket_id: {
        $in: connectedSocketIds
      }
    }).toArray();

    // Convert each user to camelCase
    connectedUsers = connectedUsers.map(user => {
      return objPropsSnakeCaseToCamelCase(user);
    });

    return connectedUsers;
  } catch (exc) {
    throw exc;
  }
};

export default fetchConnectedUsers;