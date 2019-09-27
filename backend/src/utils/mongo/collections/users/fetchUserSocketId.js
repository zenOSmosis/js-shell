import fetchUsersCollection from './fetchUsersCollection';
import fetchConnectedSocketIds from 'utils/p2p/fetchConnectedSocketIds';
import {
  MONGO_DB_USERS_FIELD_SOCKET_ID,
  MONGO_DB_USERS_FIELD_USER_ID
} from './fields';

const fetchUserSocketId = async (userId) => {
  try {
    const usersCollection = await fetchUsersCollection();

    // @see https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#findOne
    const objResult = await usersCollection.findOne({
      [MONGO_DB_USERS_FIELD_USER_ID]: userId,
    }, {
      projection: {
        _id: false,
        [MONGO_DB_USERS_FIELD_SOCKET_ID]: true
      }
    });

    if (!objResult) {
      return;
    }

    const { socketId } = objResult;

    // If user is not connected, don't return the socketId
    const connectedSocketIds = await fetchConnectedSocketIds();
    if (!connectedSocketIds.includes(socketId)) {
      return;
    }

    return socketId;
  } catch (exc) {
    throw exc;
  }
};

export default fetchUserSocketId;