// TODO: Implement EVT_READY
// TODO: Implement terminate detection

import ClientWorkerProcessCommonCore from './ClientWorkerProcessCommonCore';
import R_ClientWorkerProcess from './dispatch.worker';
import serialize from 'serialize-javascript';

/**
 * The ClientWorkerProcess class, which acts as a green-threaded controller to
 * the ClientWorkerProcess.worker class, which runs in a native Worker.
 */
export default class ClientWorkerProcessHost extends ClientWorkerProcessCommonCore {
  /**
   * Note, cmd gets executed directly in the worker, instead of in the main thread.
   * 
   * @param {ClientProcess} parentProcess 
   * @param {Function} cmd 
   * @param {Object} options [optional]
   */
  constructor(parentProcess, cmd, options = {}) {
    const defOptions = {
      // The native Worker implementation
      // worker-loader callable *.worker.js extension
      DispatchWorker: R_ClientWorkerProcess
    };

    options = Object.assign({}, defOptions, options);

    super(
      parentProcess,

      // Override initial parent process with an empty instruction
      // (cmd is passed to worker thread further down)
      () => {},

      options
    );

    this._nativeWorker = null;

    // This is the host, running on the main thread, so this is not the worker
    this._isWorker = false;

    // Hardcoded; TODO: Obtain dynamic URI from native Worker
    this._serviceURI = `[blob://ClientWorker]`;

    this._workerCmd = cmd;
  }

  /**
   * @return {Promise<void>} Resolves after native Worker and super class have
   * initialized.
   */
  async _init() {
    try {
      this.setImmediate(async () => {
        try {
          await this._initNativeWorker();

          // Init super class
          await super._init();
        } catch (exc) {
          throw exc;
        }
      });
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * @return {Promise<void>} Resolves after native Worker is initialized.
   */
  async _initNativeWorker() {
    try {
      return new Promise((resolve, reject) => {
        try {
          if (this._nativeWorker) {
            throw new Error('nativeWorker is already initialized');
          }
  
          // Launch the native Worker
          const { DispatchWorker } = this._options;
          this._nativeWorker = new DispatchWorker();
          
          console.debug('Post initializaing native worker', this._nativeWorker);
      
          // Instantiate communications
          // TODO: Rework this
          (() => {
            // TODO: Event emitter... listen once for 'hello'
  
            const cmd = this._workerCmd;
            const options = serialize(this._options);
            const serializedCmd = cmd.toString();
  
            const pid = this.getPID();
  
            const sendData = {
              host: {
                pid,
                options // TODO: Implement serizable options
              },
              serializedCmd
            };
  
            console.debug('Sending init comm to native worker', sendData);
            
            // Send init message (first message is the init)
            this._nativeWorker.postMessage(sendData);
      
            // Handle message receiving
            this._nativeWorker.onmessage = (message) => {
              this._routeMessage(message);
            };
          })();
          
          // this._serviceURI = this._nativeWorker.getServiceURI();
  
          // TODO: Don't resolve until native worker is init and ready for usage
          resolve();
        } catch (exc) {
          reject(exc);
        }
      });
    } catch (exc) {
      throw exc;
    }
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