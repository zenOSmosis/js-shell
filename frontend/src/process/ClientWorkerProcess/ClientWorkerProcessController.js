/**
 * This module runs on the main thread, and acts as a controller to the remote
 * native Web Worker process (extended from ClientWorkerProcess).
 */

// TODO: Implement EVT_READY
// TODO: Implement terminate detection

import ClientWorkerProcessCommonCore, {
  WORKER_CTRL_IN_PIPE_NAME,
  WORKER_CTRL_OUT_PIPE_NAME
} from './ClientWorkerProcessCommonCore';
import ClientWorkerProcess from './dispatch.worker';
// import serialize from 'serialize-javascript';

export default class ClientWorkerProcessController extends ClientWorkerProcessCommonCore {
  /**
   * Note, cmd gets executed directly in the worker, instead of in the main thread.
   * 
   * @param {ClientProcess} parentProcess 
   * @param {Function} cmd 
   * @param {Object} options [optional]
   */
  constructor(parentProcess, cmd, options = {}) {
    const defOptions = {
      // The native Web Worker implementation
      // worker-loader callable *.worker.js extension
      DispatchWorker: ClientWorkerProcess
    };

    options = Object.assign({}, defOptions, options);

    super(
      parentProcess,

      // Override initial parent process with an empty instruction
      // (cmd is passed to worker thread further down)
      () => { },

      options
    );

    // Represents the native Web Worker
    this._nativeWorker = null;
    this._isNativeWorkerInit = false;

    // This is the host, running on the main thread, so this is not the worker
    this._isNativeWorker = false;

    // This is set by the ClientWorkerProcess (or extension) after it has
    // initialized
    this._serviceURI = '[Initializing...]';

    // Important! It is IMPERATIVE to use setImmediate here, or the command
    // will not be utilize class extensions, and only be available to the super
    // ClientWorkerProcess
    this.setImmediate(() => {
      this._workerCmd = cmd;
    });
  }

  /**
   * Automatically invoked by the super ClientProcess.
   * 
   * @return {Promise<void>} Resolves after native Web Worker and super class have
   * initialized.
   */
  async _init() {
    try {
      console.debug('INITIALIZING WORKER PROCESS CONTROLLER', this.getPID());

      await this._initNativeWorker();

      const pid = this.getPID();

      // Important! It is IMPERATIVE to use Promise here, or the
      // serialized cmd won't be available for the worker 
      await new Promise((resolve, reject) => {
        try {
          const serializedCmd = (this._workerCmd ? this._workerCmd.toString() : null);

          this[WORKER_CTRL_IN_PIPE_NAME].write({
            // TODO: Use constant for ctrlMessage
            ctrlMessage: 'hostReady',
            data: {
              pid,
              serializedCmd
            }
          });

          resolve();
        } catch (exc) {
          reject(exc);
        }
      });

      // TODO: Await worker message stating the ClientWorkerProcess is init

      // Init super class
      await super._init();
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * @return {Promise<void>} Resolves after native Web Worker is initialized.
   */
  _initNativeWorker() {
    return new Promise(async (resolve, reject) => {
      if (this._isNativeWorkerInit) {
        throw new Error('Native Worker has already initialized.');
      }

      try {
        if (this._nativeWorker) {
          console.warn('nativeWorker is already initialized', this._nativeWorker);
          return;
        }

        // Launch the native Web Worker
        const { DispatchWorker } = this._options;
        this._nativeWorker = new DispatchWorker();

        // Re-route native Web Worker postMessage() calls
        this._nativeWorker.onmessage = (message) => {
          this._routeMessage(message);
        };

        /*
        // Await for control data from native Web Worker
        await (async () => {
          try {
            return new Promise((ctrlResolve, ctrlReject) => {
              try {
                const handleInitialCtrl = (data) => {
                  const { serviceURI } = data;
                  this._serviceURI = serviceURI;
                  console.debug('received worker ctrl_out_pipe_data', data);
    
                  // Stop listening to initial ctrl data
                  this[WORKER_CTRL_OUT_PIPE_NAME].off('data', handleInitialCtrl);

                  ctrlResolve();
                };
    
                // Start listenting for initial ctrl data
                this[WORKER_CTRL_OUT_PIPE_NAME].on('data', handleInitialCtrl);
              } catch (exc) {
                ctrlReject(exc);
              }
            });
          } catch (exc) {
            throw exc;
          }
        })();
        */

        this[WORKER_CTRL_OUT_PIPE_NAME].on('data', (data) => {
          console.debug('Received post init ctrl data', data);
        });

        this._isNativeWorkerInit = true;

        // Resolve that native Web Worker is init
        resolve();
      } catch (exc) {
        reject(exc);
      }
    });
  }

  /**
   * Sends a message using the native Web Worker's postMessage().
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