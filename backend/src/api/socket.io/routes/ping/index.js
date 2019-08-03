const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');

const ping = async(options = {}, ack) => {
  return /*await*/ handleSocketAPIRoute(/*async*/ () => {
    return 'host:pong';
  }, ack);
};

module.exports = ping;