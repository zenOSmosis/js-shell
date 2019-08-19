const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');

const ping = async (data = {}, ack) => {
  return await handleSocketAPIRoute(() => {
    return data;
  }, ack);
};

module.exports = ping;