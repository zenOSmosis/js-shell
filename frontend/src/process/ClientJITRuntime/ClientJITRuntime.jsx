import ClientProcess from '../ClientProcess';
import React from 'react';

// [main threaded] JITRuntime included shared objects
import getLogicalProcessors from 'utils/getLogicalProcessors';
import ClientGUIProcess from 'process/ClientGUIProcess';
import ClientWorkerProcess from 'process/ClientWorkerProcess';
// import FilesystemProcess from 'process/FilesystemProcess';
// import DependencyFetcherWorker from 'process/DependencyFetcherWorker';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';

export default class ClientJITRuntime extends ClientProcess {
  constructor(parentProcess) {
    // Default parentProcess to being non-forked (subject to change)
    if (!parentProcess) {
      console.warn('parentProcess defaulting to false could be subject to change');
      parentProcess = false; 
    }

    super(parentProcess);
  }

  compile(code) {
    console.warn('TODO: Move code compilation to separate thread. Remove Babel compiler script inclusion from index.html');

    let compiledCode = window.Babel.transform(code, { presets: ['react', 'es2015'] }).code;
    
    compiledCode = compiledCode.split('undefined').join('this');

    return compiledCode;
  }

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

  evalInContext(code, context = {}){
    const exec = () => {
      const wrappedCode = `
        (() => {
          ${code}
        })();
      `;
  
      eval(wrappedCode);
    };
  
    return exec.call(context);
  }
  
  evalInProtectedContext(code, context = {}) {
    code = `
      ((nativeWindow) => {
        // Note: Usage of let instead of const to allow user to override
        const { process } = this;
        const { setImmediate } = process;
  
        let window = undefined;      
        let document = undefined;
        let self = undefined;
  
        ${code}
      })(window);
    `;
  
    return this.evalInContext(code, context);
  }
}