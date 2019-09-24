import fetchUsersCollection from './fetchUsersCollection';
import {
  MONGO_DB_USERS_FIELD_USER_ID,
  MONGO_DB_USERS_FIELD_UPDATE_TIME
} from './fields';
import { objPropsCamelCaseToSnakeCase } from '../../converters';

/**
 * @param {MongoShellUserData} mongoShellUserData 
 */
const setUserData = async (userData, socket = null) => {
  try {
    const usersCollection = await fetchUsersCollection();

    const { userId } = userData;

    if (userId === undefined) {
      throw new Error('userId must be specified when setting user data');
    }

    const writeUserData = objPropsCamelCaseToSnakeCase(userData);

    await usersCollection.updateOne({
      [MONGO_DB_USERS_FIELD_USER_ID]: userId
    }, {
      $set: {
        ...writeUserData,
        [MONGO_DB_USERS_FIELD_UPDATE_TIME]: new Date().toISOString()
      },

      $addToSet: {
        socket_ids: socket.id
      }
    }, {
      upsert: true // On non-exist, create
    });
  } catch (exc) {
    throw exc;
  }
};

export default setUserData;