const handleSocketRoute = require('../../utils/handleSocketRoute');

const ping = async(options = {}, ack) => {
  return /*await*/ handleSocketRoute(/*async*/ () => {
    return 'host:pong';
  }, ack);
};

module.exports = ping;