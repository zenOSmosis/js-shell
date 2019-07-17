// @see https://nodejs.org/docs/latest/api/os.html#os_os_networkinterfaces

const os = require('os');

const getNetworkInterfaces = () => {
  return os.networkInterfaces();
};

module.exports = {
  getNetworkInterfaces
};