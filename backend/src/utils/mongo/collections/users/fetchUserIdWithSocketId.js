import fetchUsersCollection from './fetchUsersCollection';
import { objPropsSnakeCaseToCamelCase } from '../../converters';

/**
 * Retrieves the user with the given Socket.io id.
 * 
 * @param {string} socketId
 * @retrurn {Promise<string>}
 */
const fetchUserIdWithSocketId = async (socketId) => {
  try {
    const usersCollection = await fetchUsersCollection();

    // @see https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#findOne
    let objUserId = await usersCollection.findOne({
      socket_ids: {
        $in: [socketId]
      },
    }, {
      projection: {
        _id: false,
        user_id: true
      }
    });

    if (!objUserId) {
      return;
    }

    // Convert snake_case to camelCase
    objUserId = objPropsSnakeCaseToCamelCase(objUserId);
    
    const { userId } = objUserId;
    return userId;
  } catch (exc) {
    throw exc;
  }
};

export default fetchUserIdWithSocketId;