import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';
import fetchConnectedSocketIds from 'utils/p2p/fetchConnectedSocketIds';

const fetchSocketIds = async (options = {}, ack) => {
  return await handleSocketAPIRoute(async () => {
    const socketIds = await fetchConnectedSocketIds();

    return socketIds;
  }, ack);
};

export default fetchSocketIds;