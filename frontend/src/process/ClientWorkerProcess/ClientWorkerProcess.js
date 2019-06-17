// TODO: Look into: https://github.com/mohayonao/inline-worker/

import ClientProcess, {
  THREAD_TYPE_DISTINCT,
  PIPE_NAMES
} from '../ClientProcess';
import ClientWorkerDispatchPipe from './ClientWorkerDispatchPipe';
import ClientWorker from './ClientWorkerProcess.worker';
// import createWebWorker from 'utils/createWebWorker';
// import getSerializedWorkerProcess from './ClientWorker_WorkerProcess';

// TODO: Rename to ClientWorkerHostProcess
export default class ClientWorkerProcess extends ClientProcess {
  constructor(parentProcess, cmd) {
    super(
      parentProcess,

      // Override initial parent process with an empty instruction
      // (cmd is serialized, then executed, further down)
      (proc) => {}
    );

    this._threadType = THREAD_TYPE_DISTINCT;
    this._base = 'ClientWorkerProcess';
    this._nativeWorker = null;

    this._initNativeWorker(cmd);
  }

  _initNativeWorker(cmd) {
    this._nativeWorker = new ClientWorker();
    
    console.debug('Initialized native worker:', this._nativeWorker);

    // Instantiate communications
    (() => {
      const pid = this.getPID();
      
      // Send init message (first message is the init)
      this._nativeWorker.postMessage({
        // This process is the 'controller'
        controller: {
          pid
        },
        serializedCmd: cmd.toString()
      });

      this._nativeWorker.onmessage = (message) => {
        // console.debug('Received message event from native worker', message);

        const { data } = message;
      
        // Route to stdio
        const { pipeName, data: writeData } = data;
        if (pipeName
            && this[pipeName]) {
          this[pipeName].write(writeData);
        } else {
          console.warn('Unhandled pipe message', message);
        }
      };

      // Event emitter... listen once
    })();
    
    // this._serviceURI = this._nativeWorker.getServiceURI();
  }

  _initDataPipes() {
    // TODO: Use constants for pipe names
    PIPE_NAMES.forEach(pipeName => {
      this[pipeName] = new ClientWorkerDispatchPipe(this, pipeName);
    });
  }

  /**
   * Sends a message using the native Worker's postMessage().
   * 
   * @param {*} messageThe object to deliver to the worker; this will be in the
   * data field in the event delivered to the DedicatedWorkerGlobalScope.onmessage
   * handler. This may be any value or JavaScript object handled by the structured
   * clone algorithm, which includes cyclical references.
   * @param {object[]} transfer (optional) An optional array of Transferable
   * objects to transfer ownership of. If the ownership of an object is
   * transferred, it becomes unusable (neutered) in the context it was sent
   * from and becomes available only to the worker it was sent to. Transferable
   * objects are instances of classes like ArrayBuffer, MessagePort or
   * ImageBitmap objects that can be transferred. null is not an acceptable
   * value for transfer.
   */
  postMessage(message, transfer = undefined) {
    if (!this._nativeWorker) {
      console.warn('Native Worker does not exist. Ignoring postMessage call.');
      return;
    }
    
    this._nativeWorker.postMessage(message, transfer);
  }

  async kill(killSignal = 0) {
    if (this._nativeWorker) {
      // TODO: Send signal to remote worker before terminating

      this._nativeWorker.terminate();
    }

    await super.kill(killSignal);
  }
}