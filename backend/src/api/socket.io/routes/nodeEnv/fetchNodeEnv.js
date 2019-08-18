const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');

const fetchNodeEnv = async (options = {}, ack) => {
  return /*await*/ handleSocketAPIRoute(/*async*/() => {
    return process.env;
  }, ack);
};

export default fetchNodeEnv;