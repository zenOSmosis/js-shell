import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';

// TODO: Utilize utils/fetchPeerIds and don't use this different implementation
const fetchSocketIds = async (options, ack) => {
  const { io } = options;

  return await handleSocketAPIRoute(async () => {
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
  }, ack);
};

export default fetchSocketIds;