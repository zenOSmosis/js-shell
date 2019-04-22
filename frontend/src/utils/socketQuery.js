import socket from './socket.io';

const socketQuery = (eventName, requestData) => {
  return new Promise((resolve, reject) => {
    socket.emit(eventName, requestData, (resp) => {
      if (!resp) {
        return reject({
          message: 'No response for query',
          eventName,
          requestData
        });
      }

      const {err} = resp;

      if (err) {
        console.error('Socket API error:', err);
        return reject(err);
      }

      return resolve(resp);
    });
  });
};

export default socketQuery;