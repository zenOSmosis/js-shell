import fetchUsersCollection from './fetchUsersCollection';

const fetchUserSocketId = async (userId) => {
  try {
    const usersCollection = await fetchUsersCollection();

    // @see https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#findOne
    const objResult = await usersCollection.findOne({
      user_id: userId,
    }, {
      projection: {
        _id: true, // Include _id (to include something), or the sliced socket_ids will return all of the fields
        socket_ids: {
          $slice: -1
        }
      }
    });

    if (!objResult) {
      return;
    }

    const { socket_ids: socketIds } = objResult;

    const socketId = socketIds[0];

    return socketId;
  } catch (exc) {
    throw exc;
  }
};

export default fetchUserSocketId;