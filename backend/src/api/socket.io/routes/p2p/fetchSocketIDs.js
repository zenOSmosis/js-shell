const { getSocketIDs } = require('utils/p2p/socketIDs');

// TODO: Utilize utils/fetchPeerIDs and don't use this different implementation
const fetchSocketIDs = /* async */ (options = {}, ack) => {
  try {
    const peerIDs = getSocketIDs();

    ack(peerIDs);
  } catch (exc) {
    console.error(exc);
    ack({
      error: exc
    });
  }
};

module.exports = fetchSocketIDs;