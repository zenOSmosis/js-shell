// TODO: Implement ability to cancel https://dev.to/chromiumdev/cancellable-async-functions-in-javascript-5gp7
// Would be nice to keep async / await structure, and have it cancelable at the same time
// Should we implement a disconnect / reconnect cycle in order to force the cancel?  There must be a better way.

// TODO: Implement throwing of error if Socket disconnects before the response

import socket from 'utils/socket.io';
import * as enumeratedSocketAPIRoutes from 'shared/socketAPI/socketAPIRoutes';

const socketAPIRoutes = Object.keys(enumeratedSocketAPIRoutes).map(route => { 
  return enumeratedSocketAPIRoutes[route];
});

/**
 * A Promise-based wrapper around Socket.io's emit and ack() callback.
 * 
 * @param {string} eventName
 * @param {any} requestData?
 * @return {Promise<any>} Response from Socket connection.
 */
const socketAPIQuery = (eventName, requestData = null) => {
  return new Promise((resolve, reject) => {
    if (!socketAPIRoutes.includes(eventName)) {
      throw new Error(`Unknown socketAPI route: ${eventName}`);
    }

    socket.emit(eventName, requestData, ([err, resp]) => {
      if (err) {
        console.error('Socket API error:', err);
        return reject(err);
      } else if (resp === undefined) {
        // TODO: Document this object
        return reject({
          message: 'No response for query',
          eventName,
          requestData
        });
      } else {
        return resolve(resp);
      }
    });
});
};

export default socketAPIQuery;