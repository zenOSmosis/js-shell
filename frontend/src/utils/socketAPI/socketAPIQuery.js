// TODO: Implement ability to cancel https://dev.to/chromiumdev/cancellable-async-functions-in-javascript-5gp7
// Would be nice to keep async / await structure, and have it cancelable at the same time

import socket from 'utils/socket.io';

/**
 * A Promise-based wrapper around Socket.io's emit and ack() callback.
 * 
 * @param {string} eventName
 * @param {any} requestData?
 * @return {Promise<any>} Response from Socket connection.
 */
const socketAPIQuery = (eventName, requestData = null) => {
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

export default socketAPIQuery;