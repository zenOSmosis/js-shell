import fetchUsersCollection from './fetchUsersCollection';
import fetchConnectedSocketIds from 'utils/p2p/fetchConnectedSocketIds';
import {
  MONGO_DB_USERS_FIELD_SOCKET_ID,
  MONGO_DB_USERS_FIELD_SHARED_DATA
} from './fields';

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
    
    const dbConnectedUsers = await usersCollection.find({
      [MONGO_DB_USERS_FIELD_SOCKET_ID]: {
        $in: connectedSocketIds
      }
    }, {
      projection: {
        _id: false,
        [MONGO_DB_USERS_FIELD_SHARED_DATA]: true
      }
    }).toArray();

    if (!dbConnectedUsers) {
      return [];
    }

    // Extract sharedData from each user
    // (can this be done w/ the projection, instead?)
    const connectedUsers = dbConnectedUsers.map(user => {
      const { [MONGO_DB_USERS_FIELD_SHARED_DATA]: sharedData } = user;

      return sharedData;
    });

    return connectedUsers;
  } catch (exc) {
    throw exc;
  }
};

export default fetchConnectedUsers;