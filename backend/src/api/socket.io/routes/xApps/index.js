const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');
const {fetchFreedesktopApps} = require('utils/freedesktop.org/appUtils');

const requestXApps = async(options = {}, ack) => {
  return handleSocketAPIRoute(async () => {
    try {
      const apps = await fetchFreedesktopApps();

      return apps;
    } catch (exc) {
      throw exc;
    }
  }, ack);
};

module.exports = requestXApps;