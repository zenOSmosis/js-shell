// TODO: Implement ability to cancel running query.  If the availability is not
// implemented directly in socket.io, proxy it

import socket from './socket.io';
import socketAPIRoutes from './socketAPIRoutes';

const socketQuery = (eventName, requestData = null) => {
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
export {
  socketAPIRoutes
};