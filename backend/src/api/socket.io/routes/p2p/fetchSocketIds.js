import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';
import fetchConnectedSocketIds from 'utils/socketIO/fetchConnectedSocketIds';

// TODO: Utilize utils/fetchPeerIds and don't use this different implementation
const fetchSocketIds = async (options = {}, ack) => {
  return await handleSocketAPIRoute(async () => {
    const socketIds = await fetchConnectedSocketIds();

    return socketIds;
  }, ack);
};

export default fetchSocketIds;