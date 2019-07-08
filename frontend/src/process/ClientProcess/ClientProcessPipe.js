// TODO: Implement Readable & Writable Streams (or make API consistent w/)
// For an example:
// @see https://www.npmjs.com/package/ogg

import EventEmitter from 'events';
import { EVT_PIPE_DATA, EVT_BEFORE_EXIT } from './constants';

export default class ClientProcessPipe extends EventEmitter {
  constructor(clientProcess, pipeName) {
    if (!clientProcess) {
      throw new Error('clientProcess must be passed to ClientProcessPipe constructor');
    }

    if (!pipeName) {
      throw new Error('pipeName must be passed to ClientProcessPipe constructor');
    }

    super();

    this._clientProcess = clientProcess;
    this._pipeName = pipeName;

    // Automatically destruct pipe before exiting process
    this._clientProcess.once(EVT_BEFORE_EXIT, () => {
      this.destruct();
    });
  }

  write(data) {
    return this.emit(EVT_PIPE_DATA, data);
  }

  destruct() {
    // console.debug('Shutting down pipe', this);

    this.removeAllListeners();
  }
}