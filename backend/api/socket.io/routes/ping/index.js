const handleSocketRoute = require('../../utils/handleSocketRoute');

const ping = async(options = {}, ack) => {
  return /*await*/ handleSocketRoute(/*async*/ () => {
    // TODO: Handle options here

    return 'host:pong';
  }, ack);
};

module.exports = ping;