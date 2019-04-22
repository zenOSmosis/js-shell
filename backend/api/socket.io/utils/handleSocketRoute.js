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
  } catch (err) {
    // Send serialized error to ack
    // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
    await (async () => {
      let { message, fileName, lineNumber, columnNumber, name } = err;

      const stack = await fetchStackTrace.fromError(err);

      const serialzedErr = {
        err: {
          message,
          name,
          fileName,
          lineNumber,
          columnNumber,
          stack,
          code: serviceCall.toString()
        }
      };

      ack(serialzedErr);
    })();
  }
};

module.exports = handleSocketRoute;