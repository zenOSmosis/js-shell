const handleSocketRoute = require('../../utils/handleSocketRoute');

const ping = async(data = {}, ack) => {
  return handleSocketRoute( () => {
    return data;
  }, ack);
};

module.exports = ping;