import getIO from '../socketIO/getIO';

const fetchConnectedSocketIds = async () => {
  try {
    const io = getIO();

    // @see https://www.npmjs.com/package/socket.io-redis#redisadapterclientsroomsarray-fnfunction
    const socketIds = await new Promise((resolve, reject) => {
      io.of('/').adapter.clients((err, clients) => {
        // console.log(clients); // an array containing all connected socket ids
        if (err) {
          return reject(err);
        } else {
          return resolve(clients);
        }
      });
    });

    return socketIds;
  } catch (exc) {
    throw exc;
  }
};

export default fetchConnectedSocketIds;