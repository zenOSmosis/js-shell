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
 * @return {Promise<void>}
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
    // Emit error to local console
    console.error(err);

    // Then, send error up to ack so that it can be debugged in the UI
    // Keep in mind, even in production scenarios, this should be done as
    // well, because the Desktop environment should be connected in every
    // single way to the backend

    // Send serialized error to ack
    // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
    await (async () => {
      let { message, fileName, lineNumber, columnNumber, name } = err;

      // Debuggable error stack
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