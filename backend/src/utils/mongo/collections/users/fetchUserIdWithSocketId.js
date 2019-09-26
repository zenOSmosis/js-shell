import fetchUsersCollection from './fetchUsersCollection';

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
      socket_id: socketId
    }, {
      projection: {
        _id: false,
        user_id: true
      }
    });

    if (!objUserId) {
      return;
    }
    
    const { user_id: userId } = objUserId;
    return userId;
  } catch (exc) {
    throw exc;
  }
};

export default fetchUserIdWithSocketId;