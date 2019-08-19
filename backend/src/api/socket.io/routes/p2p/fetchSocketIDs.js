const { getSocketIDs } = require('utils/p2p/socketIDs');
const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');

// TODO: Utilize utils/fetchPeerIDs and don't use this different implementation
const fetchSocketIDs = async (options = {}, ack) => {
  return await handleSocketAPIRoute(() => {
    return getSocketIDs();
  }, ack);
};

module.exports = fetchSocketIDs;