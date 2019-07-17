const handleSocketRoute = require('../../utils/handleSocketRoute');

const ping = async(options = {}, ack) => {
  return /*await*/ handleSocketRoute(/*async*/ () => {
    return process.env;
  }, ack);
};

module.exports = ping;