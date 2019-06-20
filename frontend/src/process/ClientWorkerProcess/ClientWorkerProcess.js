// TODO: Implement EVT_READY
// TODO: Implement terminate detection

import ClientWorkerProcessCommonCore from './ClientWorkerProcessCommonCore';
import ClientWorker from './ClientWorkerProcess.worker';

/**
 * The ClientWorkerProcess class, which acts as a green-threaded controller to
 * the ClientWorkerProcess.worker class, which runs in a native Worker.
 */
export default class ClientWorkerProcess extends ClientWorkerProcessCommonCore {
  constructor(parentProcess, cmd) {
    super(
      parentProcess,

      // Override initial parent process with an empty instruction
      // (cmd is serialized, then executed, further down)
      (proc) => {}
    );

    this._deferredCmd = cmd;
    
    this._nativeWorker = null;
  }

  async _init() {
    try {
      await this._initNativeWorker();

      super._init();
    } catch (exc) {
      throw exc;
    }
  }

  async _initNativeWorker() {
    return new Promise((resolve, reject) => {
      try {
        if (this._nativeWorker) {
          throw new Error('nativeWorker is already initialized');
        }
    
        this._nativeWorker = new ClientWorker();
        
        console.debug('Initialized native worker:', this._nativeWorker);
    
        // Instantiate communications
        (() => {
          const cmd = this._deferredCmd;
          const serializedCmd = cmd.toString();

          const pid = this.getPID();
          
          // Send init message (first message is the init)
          this._nativeWorker.postMessage({
            // This process is the 'controller'
            controller: {
              pid
            },
            serializedCmd
          });
    
          // Handle message receiving
          this._nativeWorker.onmessage = (message) => {
            this._routeMessage(message);
          };
    
          // Event emitter... listen once
        })();
        
        // this._serviceURI = this._nativeWorker.getServiceURI();

        resolve();
      } catch (exc) {
        reject(exc);
      }
    });
  }

  /**
   * Sends a message using the native Worker's postMessage().
   * 
   * @param {any} message The object to deliver to the worker; this will be in the
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