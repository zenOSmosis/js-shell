const fetchStackTrace = require('stacktrace-js');

/**
 * Directly handles Socket.io events, abstracting them as "routes."
 * 
 * Instead of taking data as the first argument, a function, named
 * "serviceCall" is utilized instead, where the return of the function is
 * passed back up to the client via the ack response.
 * 
 * @param {Function} serviceCall The serviceCall function to run. 
 * @param {Function} ack Data passed to this function is returned to the
 * client.
 */
const handleSocketRoute = async (serviceCall, ack) => {
  try {
    if (typeof ack !== 'function') {
      ack = () => null;
    }

    const serviceResp = await serviceCall();

    // Send acknowledgement to client
    ack(serviceResp);
  } catch (error) {
    const {message} = error;

    const errMsg = message || error;
    const errorStack = await fetchStackTrace.fromError(error);

    // Send error to client
    ack({
      error: errMsg,
      errorStack
    });
  }
};

module.exports = handleSocketRoute;