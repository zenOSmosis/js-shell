const handleSocketRoute = require('../../utils/handleSocketRoute');
const {fetchFreedesktopApps} = require('../../../../utils/freedesktop.org/appUtils');

const requestApps = async(options = {}, ack) => {
  return handleSocketRoute(async () => {
    try {
      const apps = await fetchFreedesktopApps();

      return apps;
    } catch (exc) {
      throw exc;
    }
  }, ack);
};

module.exports = requestApps;