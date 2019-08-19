const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');

// TODO: Rename / move to node/fetchSystemTime or node/fetchUnixTime
const systemTime = async (options = {}, ack) => {
  return await handleSocketAPIRoute(() => {
    return new Date();
  }, ack);
};

module.exports = systemTime;