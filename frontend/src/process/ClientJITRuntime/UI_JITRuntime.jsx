import React, { Component } from 'react';
import ClientJITRuntime, { THIS_REP } from './ClientJITRuntime';

// [main threaded] JITRuntime included shared objects

import BabelCompilerWorkerProcess from 'process/BabelCompilerWorkerProcess';
import ClientProcess from 'process/ClientProcess';
import ClientGUIProcess from 'process/ClientGUIProcess';
import AppRuntime from 'core/AppRuntime';
import ClientWorkerProcess from 'process/ClientWorkerProcess';
import MicrophoneProcess from 'process/MicrophoneProcess';
import ClientAudioWorkerProcess from 'process/ClientAudioWorkerProcess';
import CPUThreadTimer from 'process/ClientProcess';
// import FilesystemProcess from 'process/FilesystemProcess';
// import DependencyFetcherWorker from 'process/DependencyFetcherWorker';
import AnalogVUMeter from 'components/AnalogVUMeter';
import Center from 'components/Center';
import Cover from 'components/Cover';
import IFrame from 'components/IFrame';
import Window from 'components/Desktop/Window';
import socketAPIQuery from 'utils/socketAPI/socketAPIQuery';
import SocketChannel from 'shared/socketAPI/SocketChannel';

// Note: Currently commented-out due to inconsistent exports
// import socketAPIRoutes from 'shared/socketAPI/socketAPIRoutes';
// import socketAPIEvents from 'utils/socketAPIEvents';

import beep from 'utils/audio/beep';
import getLogicalProcessors from 'utils/getLogicalProcessors';
import getPrototypeChain from 'utils/class/getPrototypeChain';
import * as socketFS from 'utils/socketFS';
import {
  fetchAggregatedMediaDeviceInfo,
  fetchMediaDevices
} from 'utils/mediaDevices';

/**
 * @extends ClientJITRuntime
 * 
 * JITRuntime for the main thread (has access to the DOM).
 */
class UI_JITRuntime extends ClientJITRuntime {
  constructor(parentProcess, code, options = {}) {
    let { context } = options;

    const predefinedContext = {
      process: THIS_REP,
      
      BabelCompilerWorkerProcess,
      ClientProcess,
      ClientGUIProcess,
      AppRuntime,
      
      ClientWorkerProcess,
      MicrophoneProcess,
      ClientAudioWorkerProcess,
      // FilesystemProcess,
      // DependencyFetcherWorker,
      React,
      Component,      
      CPUThreadTimer,
      SocketChannel,

      // (e.g. reference this.zdComponents in evaluated scripting)
      components: {
        AnalogVUMeter,
        Center,
        Cover,
        IFrame,
        Window
      },

      utils: {
        audio: {
          beep
        },
        getLogicalProcessors,
        getPrototypeChain,
        mediaDevices: {
          fetchAggregatedMediaDeviceInfo,
          fetchMediaDevices 
        },
        socketAPIQuery,
        // socketAPIRoutes,
        // socketAPIEvents

        socketFS
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

export default UI_JITRuntime;