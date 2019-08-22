// TODO: Implement ability to cancel https://dev.to/chromiumdev/cancellable-async-functions-in-javascript-5gp7
// Would be nice to keep async / await structure, and have it cancelable at the same time
// Should we implement a disconnect / reconnect cycle in order to force the cancel?  There must be a better way.

// TODO: Implement throwing of error if Socket disconnects before the response

import socket from 'utils/socket.io';
import { SOCKET_API_ROUTES } from 'shared/socketAPI/socketAPIRoutes';

/**
 * A Promise-based wrapper around Socket.io's emit and ack() callback.
 * 
 * @param {string} eventName
 * @param {any} requestData?
 * @return {Promise<any>} Response from Socket connection.
 */
const socketAPIQuery = (eventName, requestData = null) => {
  return new Promise((resolve, reject) => {
    if (!SOCKET_API_ROUTES.includes(eventName)) {
      throw new Error(`Unknown socketAPI route: ${eventName}`);
    }

    socket.emit(eventName, requestData, (resp) => {
      if (typeof resp === 'undefined') {
        // TODO: Document this object
        return reject({
          message: 'No response for query',
          eventName,
          requestData
        });
      }

      if (typeof resp !== 'undefined') {
        const { err } = resp;

        if (err) {
          console.error('Socket API error:', err);
          return reject(err);
        }
  
        return resolve(resp);
      } else {
        return resolve();
      }
    });
  });
};

export default socketAPIQuery;