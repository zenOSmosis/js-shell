import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';
const { fetchFreedesktopApps } = require('utils/freedesktop.org/appUtils');

// TODO: Remove this API
const requestXApps = async (options = {}, ack) => {
  return await handleSocketAPIRoute(async () => {
    try {
      const apps = await fetchFreedesktopApps();

      return apps;
    } catch (exc) {
      throw exc;
    }
  }, ack);
};

module.exports = requestXApps;