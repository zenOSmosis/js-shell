/**
 * Named similar to C++'s MakeCallback for Node.js.
 * 
 * Applies the given scope to the given callback, both as context, and as a
 * first argument.
 *
 * @param {Object} scope 
 * @param {Function} callback 
 */
const makeCallback = (scope, callback) => {
  if (typeof scope !== 'object') {
    throw new Error('Scope must be an object');
  }

  const exec = async () => {
    try {
      if (typeof callback === 'function') {
        await callback.apply(scope, [scope]);
      }

      // Unset the callback
      callback = undefined;
    } catch (exc) {
      // Unset the callback
      callback = undefined;

      throw exc;
    }
  };

  // Note: We're not executing the callback now, just passing the callback
  // function.
  return exec;
};

export default makeCallback;