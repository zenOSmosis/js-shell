import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';

// TODO: Rename / move to node/fetchSystemTime or node/fetchUnixTime
const systemTime = async (options = {}, ack) => {
  return await handleSocketAPIRoute(() => {
    return new Date();
  }, ack);
};

export default systemTime;