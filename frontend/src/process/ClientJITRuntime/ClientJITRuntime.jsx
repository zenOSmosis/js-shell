import ClientProcess from '../ClientProcess';
import BabelCompilerWorkerProcess from '../BabelCompilerWorkerProcess';

import evalInContext from 'utils/evalInContext';

// A temporary string representation for "this"
// Used for when passing context to the ClientJITRuntime which represents the runtime instance
// e.g. { process: THIS_REP } would be replaced with { process: this }
export const THIS_REP = '%___THIS___%';

/**
 * @extends ClientProcess
 * 
 * Process-driven JS code runtime.
 */
class ClientJITRuntime extends ClientProcess {
  constructor(parentProcess = false, code = null, options = {}) {
    const { context } = options;

    // Default parentProcess to being non-forked (subject to change)
    if (parentProcess === false) {
      console.warn(`
        parentProcess defaulting to false could be subject to change.
        It is recommended to pass parentProcess to a new process.
      `);
    }

    // The "code" argument is not yet passed in the parent
    super(parentProcess);

    this._context = {};

    this.setContext(context);

    this.setImmediate(() => {
      // If code is supplied, automatically execute it
      if (code) {
        this.exec(code);
      }
    });
  }

  /**
   * Sets the context (scope) of the code.
   * 
   * @param {Object} context 
   */
  setContext(context) {
    if (Object.keys(this._context).length) {
      throw new Error('Context is already set.');
    }

    this._context = ((context) => {
      const keys = Object.keys(context);
      keys.forEach(key => {
        // Replace THIS_REP representations w/ "this" keyword
        if (context[key] === THIS_REP) {
          context[key] = this;
        }
      });

      return context;
    })(context);
  }

  /**
   * @param {string} code
   * @return {Promise<String>} Transformed output 
   */
  async compile(code, babelCompilerWorker) {
    try {
      code = code.toString();

      babelCompilerWorker.stdctrl.write({
        ctrlName: 'compile',
        ctrlData: code
      });

      return await new Promise((resolve, reject) => {
        try {
          babelCompilerWorker.stdctrl.on('data', (data) => {
            const { ctrlName } = data;

            if (ctrlName === 'compiledCode') {
              const { ctrlData: compiledCode } = data;

              resolve(compiledCode);
            }
          });
        } catch (exc) {
          reject(exc);
        }
      });
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Evaluates the given code in the current thread w/ a custom context.
   * 
   * @param {string} code 
   */
  async exec(code) {
    try {
      const babelCompilerWorker = new BabelCompilerWorkerProcess(this);
      
      // Wait for compiler, etc. to be ready before continuing
      await babelCompilerWorker.onceReady();

      const compiledCode = await this.compile(code, babelCompilerWorker);

      // We're done w/ the compiler
      babelCompilerWorker.exit();

      // Evaluate JavaScript in the given context
      this._evalInProtectedContext(compiledCode);
    } catch (exc) {
      throw exc;
    }
  }

  // TODO: Evaluate differences in evalInContext and evalInProtetedContext 

  /**
   * Wraps code in an enclosure w/ modified access to the outer scope.
   * 
   * @param {string} code
   */
  _evalInProtectedContext(code) {
    const context = this._context;

    // Wrap the code
    /*
    code = `
      (() => {
        ${code}
      })();
    `;
    */

    // Perform the eval
    evalInContext(code, context);
  }
}

export default ClientJITRuntime;