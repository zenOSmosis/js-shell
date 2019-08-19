// TODO: Implement _handleCPUThreadCycle and utilize via Worker message passing

/**
 * This module runs on the main thread, and acts as a controller to the remote
 * native Web Worker process (extended from ClientWorkerProcess).
 */

// TODO: Implement EVT_READY
// TODO: Implement terminate detection

import ClientWorkerProcessCommonCore from './ClientWorkerProcessCommonCore';
import ClientWorkerProcess from './dispatch.worker';

/**
 * @extends ClientWorkerProcessCommonCore
 * 
 * Controller for ClientWorkerProcess.
 * 
 * Note, this controller runs on the main thread, and provides I/O and control
 * data to the Web Worker.  This relationship is a 1:1 between controller and
 * Worker.
 */
class ClientWorkerProcessController extends ClientWorkerProcessCommonCore {
  /**
   * Note, cmd gets executed directly in the worker, instead of in the main thread.
   * 
   * @param {ClientProcess} parentProcess 
   * @param {function} cmd 
   * @param {Object} options [optional]
   */
  constructor(parentProcess, cmd = null, options = {}) {
    const defOptions = {
      // The native Web Worker implementation
      // worker-loader callable *.worker.js extension
      DispatchWorker: ClientWorkerProcess
    };

    options = {...defOptions, ...options};

    super(
      parentProcess,

      // Override initial parent process with an empty instruction
      // (cmd is passed to worker thread further down)
      () => { },

      options
    );

    // Important! Non-initialized workerCmd should be -1.  If no worker command
    // is given, it will be later set to null.
    this._workerCmd = -1;

    // Represents the native Web Worker
    this._nativeWorker = null;
    this._isNativeWorkerInit = false;

    // This is the host, running on the main thread, so this is not the worker
    this._isNativeWorker = false;

    // This is set by the ClientWorkerProcess (or extension) after it has
    // initialized
    this._serviceURL = '[Initializing...]';

    // Important! It is IMPERATIVE to use setImmediate (or timeout w/ 0 time
    // value) here, or the command will not be utilize class extensions, and
    // only be available to the super
    // ClientWorkerProcess
    this.setImmediate(() => {
      this._workerCmd = cmd;
    });

    (() => {
      this._initCPUThreadRootProcess();

      // Handle CPU thread usage notifications from Worker
      this.stdctrl.on('data', (data) => {
        const { cpuThreadUsagePercent } = data;
        if (typeof cpuThreadUsagePercent !== 'undefined') {
          this._handleCPUThreadCycle(cpuThreadUsagePercent);
        }
      });
    })();
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

          this.stdctrl.write({
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
   * TODO: Document
   * 
   * @return {string | Function}
   */
  getWorkerCmd() {
    if (this._workerCmd === -1) {
      throw new Error('workerCmd has not initialized');
    }
    
    return this._workerCmd;
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

  /**
   * Kills the native Worker.
   * 
   * @param {number} exitSignal 
   */
  async exit(exitSignal = 0) {
    if (this._nativeWorker) {
      // TODO: Send signal to remote worker before terminating

      this._nativeWorker.terminate();
    }

    await super.exit(exitSignal);
  }
}

export default ClientWorkerProcessController;