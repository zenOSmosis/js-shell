import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';

const ping = async (options = {}, ack) => {
  return await handleSocketAPIRoute(() => {
    return 'host:pong';
  }, ack);
};

export default ping;