import fetchSocketsCollection from './fetchSocketsCollection';
import {
  MONGO_DB_SOCKETS_FIELD_SOCKET_ID,
  MONGO_DB_SOCKETS_FIELD_CONNECTION_TIME
} from './fields';

const addSocketId = async (socketId) => {
  try {
    const socketCollection = await fetchSocketsCollection();
    await socketCollection.insertOne({
      [MONGO_DB_SOCKETS_FIELD_SOCKET_ID]: socketId,
      [MONGO_DB_SOCKETS_FIELD_CONNECTION_TIME]: new Date().toISOString()
    });
  } catch (exc) {
    throw exc;
  }
};

export default addSocketId;