
import ClientProcess, {
  EVT_PIPE_DATA,
  THREAD_TYPE_DISTINCT,
  PIPE_NAMES
} from '../ClientProcess';
import ClientWorkerDispatchPipe from './ClientWorkerDispatchPipe';
// import ClientWorker from './ClientWorkerProcess.worker';

/**
 * Common class which ClientWorkerProcess and ClientWorkerProcess.worker are
 * based on.
 */
export default class ClientWorkerProcessCommonCore extends ClientProcess {
  constructor(...args) {
    super(...args);

    this._threadType = THREAD_TYPE_DISTINCT;
  }

  _initDataPipes() {
    // Dynamic pipe allocation
    PIPE_NAMES.forEach(pipeName => {
      this[pipeName] = new ClientWorkerDispatchPipe(this, pipeName);
    });
  }

  /**
   * Routes messages received via postMessage() calls to stdio.
   * 
   * @param {any} message
   */
  _routeMessage(message) {
    const { data } = message;
      
    // Route to stdio
    const { pipeName, data: writeData } = data;
    if (pipeName
        && this[pipeName]) {

      // Write local (don't use pipe.write() as it sends as postMessage())
      this[pipeName].emit(EVT_PIPE_DATA, writeData);
    } else {
      console.warn('Unhandled pipe message', message);
    }
  }
}