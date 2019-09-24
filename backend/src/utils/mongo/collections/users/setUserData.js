import fetchUsersCollection from './fetchUsersCollection';
import {
  MONGO_DB_USERS_FIELD_USER_ID,
  MONGO_DB_USERS_FIELD_SHARED_DATA,
  MONGO_DB_USERS_FIELD_UPDATE_TIME
} from './fields';

/**
 * @param {MongoShellUserData} mongoShellUserData 
 */
const setUserData = async (userId, sharedData) => {
  try {
    const usersCollection = await fetchUsersCollection();

    if (userId === undefined) {
      throw new Error('userId must be specified when setting user data');
    }

    await usersCollection.updateOne({
      [MONGO_DB_USERS_FIELD_USER_ID]: userId
    }, {
      $set: {
        [MONGO_DB_USERS_FIELD_SHARED_DATA]: sharedData,
        [MONGO_DB_USERS_FIELD_UPDATE_TIME]: new Date().toISOString()
      }
    }, {
      upsert: true // On non-exist, create
    });
  } catch (exc) {
    throw exc;
  }
};

export default setUserData;