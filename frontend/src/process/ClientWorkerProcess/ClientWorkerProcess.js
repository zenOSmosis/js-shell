// TODO: Look into: https://github.com/mohayonao/inline-worker/

import ClientProcess, { THREAD_TYPE_DISTINCT } from '../ClientProcess';
import ClientWorkerDispatchPipe from './ClientWorkerDispatchPipe';
import createWebWorker from 'utils/createWebWorker';
import getSerializedWorkerProcess from './ClientWorker_WorkerProcess';

// TODO: Rename to ClientWorkerHostProcess
export default class ClientWorkerProcess extends ClientProcess {
  _base = 'ClientWorkerProcess';
  _nativeWorker = null;

  constructor(parentProcess, cmd) {
    super(
      parentProcess,

      // Override initial parent process with an empty instruction
      // (cmd is serialized, then executed, further down)
      (proc) => {}
    );

    this._threadType = THREAD_TYPE_DISTINCT;

    const code = getSerializedWorkerProcess(cmd);

    this._nativeWorker = createWebWorker(code);

    this._serviceURI = this._nativeWorker.getServiceURI();
  }

  _initDataPipes() {
    // TODO: Use constants for pipe names
    this.stdin = new ClientWorkerDispatchPipe(this, 'stdin');
    this.stdout = new ClientWorkerDispatchPipe(this, 'stdout');
    this.stderr = new ClientWorkerDispatchPipe(this, 'stderr');

    this.stdctrlin = new ClientWorkerDispatchPipe(this, 'stdctrlin');
    this.stdctrlout = new ClientWorkerDispatchPipe(this, 'stdctrlout');
  }

  /**
   * Executes postMessage() on the native Worker.
   * 
   * @param {string | object | any} message 
   */
  postMessage(message) {
    if (!this._nativeWorker) {
      console.warn('Native Worker does not exist. Ignoring postMessage call.');
      return;
    }
    this._nativeWorker.postMessage(message);
  }

  async kill(killSignal = 0) {
    if (this._nativeWorker) {
      this._nativeWorker.terminate();
    }

    await super.kill(killSignal);
  }
}