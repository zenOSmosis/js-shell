import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';

const ping = async (data = {}, ack) => {
  return await handleSocketAPIRoute(() => {
    return data;
  }, ack);
};

export default ping;