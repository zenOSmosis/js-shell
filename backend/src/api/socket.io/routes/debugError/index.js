import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';

const debugError = async (options = {}, ack) => {
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

export default debugError;