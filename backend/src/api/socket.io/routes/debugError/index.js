const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');

const error = async(options = {}, ack) => {
  return await handleSocketAPIRoute(async () => {
    try {
      return await new Promise(async (resolve, reject) => {
        try {
          throw new Error('Intentional Error');
        } catch (exc) {
          return reject(exc);
        }
      });
    } catch (exc) {
      throw exc;
    }
  }, ack);
};

module.exports = error;