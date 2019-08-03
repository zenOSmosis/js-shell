const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');

const ping = async(options = {}, ack) => {
  return /*await*/ handleSocketAPIRoute(/*async*/ () => {
    return process.env;
  }, ack);
};

module.exports = ping;