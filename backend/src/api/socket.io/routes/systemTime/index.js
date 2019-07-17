const handleSocketRoute = require('../../utils/handleSocketRoute');

const systemTime = async(options = {}, ack) => {
  return  handleSocketRoute(() => {
    return new Date();
  }, ack);
};

module.exports = systemTime;