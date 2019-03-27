const {getNetworkInterfaces} = require('../../../../utils/networkInterfaces');

const fetchNetworkInterfaces = async(options = {}, ack) => {
  try {
    const networkInterfaces = getNetworkInterfaces(); // await fetchFreedesktopApps();

    ack(networkInterfaces);
  } catch (exc) {
    // TODO: Pipe this up to ack
    throw exc;
  }
};

module.exports = fetchNetworkInterfaces;