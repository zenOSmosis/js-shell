/* eslint no-eval: 0 */

import EventEmitter from 'events';

export const DONE = 'done';

// Used internally below to emit DONE once cmd stack frame has completed
class DoneNotifier extends EventEmitter {};

/**
 * 
 * @param {string | Function | any} cmd 
 * @param {Object} context [default={}] The context in which the code will
 * be executed.
 * @return {Promise<void>}
 */
const evalInContext = async (cmd, context = {}) => {
  try {
    const isFunction = (typeof cmd === 'function');

    const code = cmd.toString();

    const __doneNotifier__ = new DoneNotifier();

    const exec = (__doneNotifier__) => {
      const wrappedCode = `
        (async () => {
          try {
            await (async () => {
              try {
                // begin code
                ${
                  (() => {
                    if (isFunction) {
                      // TODO: Pass arbitrary arguments
                      return `await ${code}(this);`;
                    } else {
                      return code;
                    }
                  })()
                }
                // end code
              } catch (exc) {
                throw exc;
              }
            })();

            // Emit we're finished
            __doneNotifier__.emit(DONE);
          } catch (exc) {
            throw exc;
          }
        })();
      `;

      eval(wrappedCode);
    };

    await new Promise((resolve, reject) => {
      try {
        // Handle DONE notification
        __doneNotifier__.once(DONE, () => {
          resolve();
        });

        exec.apply(context, [__doneNotifier__]);
      } catch (exc) {
        reject(exc);
      }
    });

  } catch (exc) {
    throw exc;
  }
};

export default evalInContext;