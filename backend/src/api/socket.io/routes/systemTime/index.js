const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');

const systemTime = async(options = {}, ack) => {
  return  handleSocketAPIRoute(() => {
    return new Date();
  }, ack);
};

module.exports = systemTime;