import fetchUsersCollection from './fetchUsersCollection';
import fetchConnectedSocketIds from 'utils/socketIO/fetchConnectedSocketIds';

const fetchUserSocketId = async (userId) => {
  try {
    const usersCollection = await fetchUsersCollection();

    // @see https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#findOne
    const objResult = await usersCollection.findOne({
      user_id: userId,
    }, {
      projection: {
        _id: false,
        socket_id: true
      }
    });

    if (!objResult) {
      return;
    }

    const { socket_id: socketId } = objResult;

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