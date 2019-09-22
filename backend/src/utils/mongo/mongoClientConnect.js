import { MongoClient } from 'mongodb';

const {
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_SHELL_DB_NAME,
  MONGO_SHELL_USERNAME,
  MONGO_SHELL_PASSWORD,
} = process.env;

// Connection URL
const MONGO_CONNECTION_URL = `mongodb://${MONGO_SHELL_USERNAME}:${MONGO_SHELL_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_SHELL_DB_NAME}?authSource=admin`;

let _cachedConnection = null;

/**
 * Connects to Shell's Mongo DB backend.
 * 
 * If a connection is already established, it will return the cached
 * connection.
 * 
 * @return {Promise<MongoClient>}
 */
const mongoConnect = async () => {
  try {
    return new Promise((resolve, reject) => {
      if (_cachedConnection) {
        return resolve(_cachedConnection);
      }

      // Use connect method to connect to the server
      MongoClient.connect(MONGO_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, function(err, client) {
        if (err) {
          return reject(err);
        } else {

          _cachedConnection = client;

          return resolve(client);
        }
      });
    });
  } catch (exc) {
    throw exc;
  }
}; 

export default mongoConnect;