const handleSocketRoute = require('../../utils/handleSocketRoute');

const error = async(options = {}, ack) => {
  return await handleSocketRoute(async () => {
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