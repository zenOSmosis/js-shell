// @see https://github.com/Streampunk/naudiodon#readme
const portAudio = require('utils/portAudio');

const fetchDevices = async (options = {}, ack) => {
  try {
    ack(portAudio.getDevices());    
  } catch (exc) {
    ack({
      err: exc
    });
  }
};

const fetchHostAPIs = async (options = {}, ack) => {
  try {
    const hostAPIs = portAudio.getHostAPIs();
    const {HostAPIs: returnHostAPIs} = hostAPIs 
    ack(returnHostAPIs);
  } catch (exc) {
    ack({
      err: exc
    });
  }
};

module.exports = {
  fetchDevices,
  fetchHostAPIs
};