import React, { Component } from 'react';
import ClientJITRuntime, { THIS_REP, BABEL_REACT_PRESETS } from './ClientJITRuntime';

// [main threaded] JITRuntime included shared objects
import getLogicalProcessors from 'utils/getLogicalProcessors';
import ClientProcess from 'process/ClientProcess';
import ClientGUIProcess from 'process/ClientGUIProcess';
import ClientWorkerProcess from 'process/ClientWorkerProcess';
import MicrophoneProcess from 'process/MicrophoneProcess';
import AudioResampler from 'process/AudioResampler';
import Float32ArrayWorker from 'process/Float32ArrayWorker';
// import PCMAudioRecorderProcess from 'process/PCMAudioRecorderProcess';
// import FilesystemProcess from 'process/FilesystemProcess';
// import DependencyFetcherWorker from 'process/DependencyFetcherWorker';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';
import IFrame from 'components/IFrame';

export default class UI_JITRuntime extends ClientJITRuntime {
  constructor(parentProcess, code, options = {}) {
    let { context } = options;

    const predefinedContext = {
      process: THIS_REP,
      getLogicalProcessors,
      ClientProcess,
      ClientGUIProcess,
      ClientWorkerProcess,
      MicrophoneProcess,
      AudioResampler,
      Float32ArrayWorker,
      // FilesystemProcess,
      // DependencyFetcherWorker,
      React,
      Component,

      // (e.g. reference this.zdComponents in evaluated scripting)
      components: {
        Window,
        Center,
        IFrame
      }
    };

    context = Object.assign({}, predefinedContext, context);

    super(parentProcess, code, {
      context,
      babelPresets: BABEL_REACT_PRESETS
    });
  }

    /**
   * Wraps code in an enclosure w/ modified access to the outer scope.
   * 
   * @param {string} code
   */
  _evalInProtectedContext(code) {

    // Wrap the code
    code = `
      ((nativeWindow) => {
        // Define, or override, native process & setImmediate implementations
        const { process, React } = this;
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
    super._evalInProtectedContext(code);
  }
}