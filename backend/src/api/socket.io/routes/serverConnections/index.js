const fetchServerConnections = async (socket, ack) => {
  try {
    if (!socket.fetchServerConnections) {
      throw new Error('fetchServerConnections is not available');
    }

    const serverConnections = await socket.fetchServerConnections();

    ack(serverConnections);
  } catch (exc) {
    console.error(exc);
    ack({
      error: exc
    });
  }
};

module.exports = fetchServerConnections;