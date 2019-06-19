import ClientProcess from '../ClientProcess';
import React from 'react';
import evalInContext from 'utils/evalInContext';

// TODO: Implement passing of context during run-time, not hardcoded

// [main threaded] JITRuntime included shared objects
import getLogicalProcessors from 'utils/getLogicalProcessors';
import ClientGUIProcess from 'process/ClientGUIProcess';
import ClientWorkerProcess from 'process/ClientWorkerProcess';
import MicrophoneProcess from 'process/MicrophoneProcess';
import PCMAudioRecorderProcess from 'process/PCMAudioRecorderProcess';
// import FilesystemProcess from 'process/FilesystemProcess';
// import DependencyFetcherWorker from 'process/DependencyFetcherWorker';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';

/**
 * Fancy name for green-threaded, eval'd code within semi-controlled process
 * context.
 */
export default class ClientJITRuntime extends ClientProcess {
  constructor(parentProcess) {
    // Default parentProcess to being non-forked (subject to change)
    if (!parentProcess) {
      console.warn('parentProcess defaulting to false could be subject to change');
      parentProcess = false; 
    }

    super(parentProcess);
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

    let compiledCode = window
                        .Babel
                        .transform(code, {
                          // TODO: Make presets adjustable
                          presets: [
                            'react',
                            'es2015',
                            // 'transform-require-context'
                          ]
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
    this.evalInProtectedContext(compiledCode, {
      process: this,
      getLogicalProcessors,
      Center,
      ClientProcess,
      ClientGUIProcess,
      ClientWorkerProcess,
      MicrophoneProcess,
      PCMAudioRecorderProcess,
      // FilesystemProcess,
      // DependencyFetcherWorker,
      React,

      // React view components under namespace "zdComponents"
      // (e.g. reference this.zdComponents in evaluated scripting)
      zdComponents: {
        Window,
        Center
      }
    });
  }

  // TODO: Evaluate differences in evalInContext and evalInProtetedContext 
  
  /**
   * Wraps code in an enclosure w/ modified access to the outer scope.
   * 
   * @param {string} code 
   * @param {object} context 
   */
  evalInProtectedContext(code, context = {}) {
    // Wrap the code
    code = `
      ((nativeWindow) => {
        // Define, or override, native process & setImmediate implementations
        const { process } = this;
        const { setImmediate } = process;
  
        // Note: Usage of let instead of const to allow user to override them as necessary
        // (some scripts may want to redefine the window object back to native, etc.)
        let window = undefined;      
        let document = undefined;
        
        const self = (this || undefined);

        ${code}

      })(window);
    `;
  
    // Perform the eval
    evalInContext(code, context);
  }
}