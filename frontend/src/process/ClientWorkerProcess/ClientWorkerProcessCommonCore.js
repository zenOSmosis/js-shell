
import ClientProcess, {
  EVT_PIPE_DATA,
  THREAD_TYPE_DISTINCT,
  PIPE_NAMES
} from '../ClientProcess';
import ClientWorkerDispatchPipe from './ClientWorkerDispatchPipe';

// Specific pipes solely for workers
export const WORKER_CTRL_IN_PIPE_NAME = 'stdWorkerCtrlIn';
export const WORKER_CTRL_OUT_PIPE_NAME = 'stdWorkerCtrlIn';

/**
 * Common class which ClientWorkerProcess and ClientWorkerProcess.worker are
 * based on.
 */
export default class ClientWorkerProcessCommonCore extends ClientProcess {
  constructor(...args) {
    super(...args);

    this._threadType = THREAD_TYPE_DISTINCT;
    this._isWorker = null;

    // Specific pipes solely for workers
    this._workerCtrlInPipe = null;
    this._workerCtrlOutPipe = null;

    this.nextTick(() => {
      if (this._isWorker === null) {
        throw new Error('_isWorker property must be set by class extension');
      }
    });
  }

  /**
   * @override
   * 
   * Note: Important that we're overriding (thus, not calling) the super
   * implementation, as we're using ClientWorkerDispatchPipe for stdio
   * allocation, instead of super's.
   */
  _initDataPipes() {
    // Dynamic pipe allocation
    PIPE_NAMES.forEach(pipeName => {
      this[pipeName] = new ClientWorkerDispatchPipe(this, pipeName);
    });

    // Specific pipes solely for workers
    this._workerCtrlInPipe = new ClientWorkerDispatchPipe(this, WORKER_CTRL_IN_PIPE_NAME);
    this._workerCtrlOutPipe = new ClientWorkerDispatchPipe(this, WORKER_CTRL_OUT_PIPE_NAME);
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