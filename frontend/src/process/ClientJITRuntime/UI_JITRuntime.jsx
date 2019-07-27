import React, { Component } from 'react';
import ClientJITRuntime, { THIS_REP } from './ClientJITRuntime';

// [main threaded] JITRuntime included shared objects
import getLogicalProcessors from 'utils/getLogicalProcessors';
import getPrototypeChain from 'utils/getPrototypeChain';

import BabelCompilerWorkerProcess from 'process/BabelCompilerWorkerProcess';
import ClientProcess from 'process/ClientProcess';
import ClientGUIProcess from 'process/ClientGUIProcess';
import ClientWorkerProcess from 'process/ClientWorkerProcess';
import MicrophoneProcess from 'process/MicrophoneProcess';
import ClientAudioWorkerProcess from 'process/ClientAudioWorkerProcess';
import CPUThreadTimer from 'process/ClientProcess';
// import FilesystemProcess from 'process/FilesystemProcess';
// import DependencyFetcherWorker from 'process/DependencyFetcherWorker';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';
import IFrame from 'components/IFrame';
import AnalogVUMeter from 'components/AnalogVUMeter';
import socketQuery from 'utils/socketQuery';

// Note: Currently commented-out due to inconsistent exports
// import socketAPIRoutes from 'utils/socketAPIRoutes';
// import socketAPIEvents from 'utils/socketAPIEvents';

import beep from 'utils/audio/beep';

export default class UI_JITRuntime extends ClientJITRuntime {
  constructor(parentProcess, code, options = {}) {
    let { context } = options;

    const predefinedContext = {
      process: THIS_REP,
      
      BabelCompilerWorkerProcess,
      ClientProcess,
      ClientGUIProcess,
      ClientWorkerProcess,
      MicrophoneProcess,
      ClientAudioWorkerProcess,
      // FilesystemProcess,
      // DependencyFetcherWorker,
      React,
      Component,      
      CPUThreadTimer,

      // (e.g. reference this.zdComponents in evaluated scripting)
      components: {
        Window,
        Center,
        IFrame,
        AnalogVUMeter
      },

      utils: {
        audio: {
          beep
        },
        getLogicalProcessors,
        getPrototypeChain,
        socketQuery,
        // socketAPIRoutes,
        // socketAPIEvents
      }
    };

    context = Object.assign({}, predefinedContext, context);

    super(parentProcess, code, {
      context
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