// TODO: Implement Readable & Writable Streams (or make API consistent w/)
// For an example:
// @see https://www.npmjs.com/package/ogg

import EventEmitter from 'events';
import { EVT_PIPE_DATA, EVT_PIPE_END, EVT_BEFORE_EXIT } from './constants';

/**
 * @extends EventEmitter
 * 
 * An event-based data pipe, used for STDIO w/ ClientProcess.
 */
class ClientProcessPipe extends EventEmitter {
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
    this._isEnded = false;

    // Automatically destruct pipe before exiting process
    this._clientProcess.once(EVT_BEFORE_EXIT, () => {
      this.destroy();
    });
  }

  /**
   * 
   * @param {string} eventType 
   * @param {any[] | any} eventData 
   */
  emit(eventType, eventData = undefined) {
    if (this._isEnded) {
      console.error('Trying to perform write operation on an ended pipe.  This is a no-op and indicates a potential memory leak in the application.');
      return;
    }

    super.emit(eventType, eventData)
  }

  /**
   * Writes the given data to the pipe.
   * 
   * @param {any} data
   */
  write(data) {
    this.emit(EVT_PIPE_DATA, data);
  }

  // TODO: Rename to destroy()
  destroy() {
    if (this._isEnded) {
      return;
    }

    this.emit(EVT_PIPE_END);

    this.removeAllListeners();

    this._isEnded = true;
  }
}

export default ClientProcessPipe;