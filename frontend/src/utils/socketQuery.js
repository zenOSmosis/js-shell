// TODO: Rename to socketAPIQuery

// TODO: Implement ability to cancel running query.  If the availability is not
// implemented directly in socket.io, proxy it

import socket from './socket.io';
import socketAPIRoutes from 'shared/socketAPI/socketAPIRoutes';

/**
 * @param {string} eventName
 * @param {any} requestData?
 * @return {Promise<any>} Response from Socket connection.
 */
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