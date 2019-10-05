import fetchUsersCollection from './fetchUsersCollection';
import {
  MONGO_DB_USERS_FIELD_USER_ID,
  MONGO_DB_USERS_FIELD_SHARED_DATA,
  MONGO_DB_USERS_FIELD_PRIVATE_DATA,
  MONGO_DB_USERS_FIELD_SOCKET_ID,
  MONGO_DB_USERS_FIELD_UPDATE_TIME
} from './fields';

/**
 * @param {Object} userData
 * @param {SocketIO.Socket | string} socket?
 */
const setUserData = async (userData, socket = null) => {
  try {
    const { sharedData, privateData } = userData;

    if (!sharedData) {
      throw new Error('No sharedData set in order to obtain userId');
    }

    const { userId } = sharedData;

    // Forbid setting of sharedData without userId
    if (userId === undefined) {
      throw new Error('userId must be specified when setting user data');
    }

    const usersCollection = await fetchUsersCollection();

    const socketId = (
      socket === null ?
        undefined :
        typeof socket === 'string' ?
          socket : socket.id
    );

    await usersCollection.updateOne({
      [MONGO_DB_USERS_FIELD_USER_ID]: userId
    }, {
      $set: {
        [MONGO_DB_USERS_FIELD_SHARED_DATA]: sharedData,
        [MONGO_DB_USERS_FIELD_PRIVATE_DATA]: privateData,
        [MONGO_DB_USERS_FIELD_SOCKET_ID]: socketId,
        [MONGO_DB_USERS_FIELD_UPDATE_TIME]: new Date().toISOString()
      },
    }, {
      upsert: true // On non-exist, create
    });

    return sharedData;
  } catch (exc) {
    throw exc;
  }
};

export default setUserData;