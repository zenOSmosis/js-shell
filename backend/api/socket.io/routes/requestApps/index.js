const {fetchFreedesktopApps} = require('../../../../utils/freedesktop.org/appUtils');

const requestApps = async(options = {}, ack) => {
  try {
    const apps = await fetchFreedesktopApps();

    ack(apps);
  } catch (exc) {
    // TODO: Pipe this up to ack
    throw exc;
  }
};

module.exports = requestApps;