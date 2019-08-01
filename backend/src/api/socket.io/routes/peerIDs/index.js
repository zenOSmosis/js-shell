const fetchPeerIDs = async (socket, ack) => {
  try {
    if (!socket.fetchPeerIDs) {
      throw new Error('fetchPeerIDs is not available');
    }

    const serverConnections = await socket.fetchPeerIDs();

    ack(serverConnections);
  } catch (exc) {
    console.error(exc);
    ack({
      error: exc
    });
  }
};

module.exports = fetchPeerIDs;