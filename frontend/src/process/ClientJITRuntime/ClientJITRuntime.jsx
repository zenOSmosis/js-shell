import ClientProcess from '../ClientProcess';

import evalInContext from 'utils/evalInContext';

// A temporary string representation for "this"
// Used for when passing context to the ClientJITRuntime which represents the runtime instance
// e.g. { process: THIS_REP } would be replaced with { process: this }
export const THIS_REP = '%___THIS___%';

export const BABEL_REACT_PRESETS = [
  'react',
  'es2015',
  // 'transform-require-context'
];

/**
 * Process-driven JS code runtime.
 */
export default class ClientJITRuntime extends ClientProcess {
  constructor(parentProcess = false, code = null, options = {}) {
    const { context, babelPresets } = options;

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
    this._babelPresets = babelPresets;

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
   * @param {object} context 
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
   * @return {string} Transformed output 
   */
  compile(code) {
    // Pre-process
    // Weird hack to retain "this" keyword passing through compiler, or else all
    // "this" references are compiled as "undefined"
    code = `
      const ___this___ = {};
      ${code}
    `.split('this').join('___this___');

    // TODO: Finish proto/compiler.js
    // TODO: Remove Babel include in index.html
    console.warn('TODO: Move code compilation to separate thread. Remove Babel compiler script inclusion from index.html');

    if (typeof window.Babel === 'undefined') {
      throw new Error('Babel is not loaded.  Check internet connection...');
    }

    let compiledCode = window
      .Babel
      .transform(code, {
        // TODO: Make presets adjustable
        presets: this._babelPresets
      }).code;

    // Post-process
    compiledCode = compiledCode.split('___this___').join('this');
    // Remove compiled version of this (if targeting es2015)
    compiledCode = compiledCode.split('var ___this___ = {};').join('');

    console.debug('compiled code:', compiledCode);

    return compiledCode;
  }

  /**
   * Evaluates the given code in the current thread w/ a custom context.
   * 
   * @param {string} code 
   */
  exec(code) {
    const compiledCode = this.compile(code);

    // Evaluate JavaScript in the given context
    this._evalInProtectedContext(compiledCode);
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
    code = `
      (() => {
        ${code}
      })();
    `;

    // Perform the eval
    evalInContext(code, context);
  }
}

