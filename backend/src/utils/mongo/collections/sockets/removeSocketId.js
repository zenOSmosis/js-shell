import fetchSocketsCollection from './fetchSocketsCollection';
import {
  MONGO_DB_SOCKETS_FIELD_SOCKET_ID
} from './fields';

const removeSocketId = async (socketId) => {
  try {
    const socketCollection = await fetchSocketsCollection();
    await socketCollection.deleteOne({
      [MONGO_DB_SOCKETS_FIELD_SOCKET_ID]: socketId
    });
  } catch (exc) {
    throw exc;
  }
};

export default removeSocketId;