import React from 'react';
import ClientJITRuntime, { THIS_REP, BABEL_REACT_PRESETS } from './ClientJITRuntime';

// [main threaded] JITRuntime included shared objects
import getLogicalProcessors from 'utils/getLogicalProcessors';
import ClientProcess from 'process/ClientProcess';
import ClientGUIProcess from 'process/ClientGUIProcess';
import ClientWorkerProcess from 'process/ClientWorkerProcess';
import MicrophoneProcess from 'process/MicrophoneProcess';
import PCMAudioRecorderProcess from 'process/PCMAudioRecorderProcess';
// import FilesystemProcess from 'process/FilesystemProcess';
// import DependencyFetcherWorker from 'process/DependencyFetcherWorker';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';

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
      PCMAudioRecorderProcess,
      // FilesystemProcess,
      // DependencyFetcherWorker,
      React,

      // (e.g. reference this.zdComponents in evaluated scripting)
      components: {
        Window,
        Center
      }
    };

    context = Object.assign({}, predefinedContext, context);

    super(parentProcess, code, {
      context,
      babelPresets: BABEL_REACT_PRESETS
    });
  }
}