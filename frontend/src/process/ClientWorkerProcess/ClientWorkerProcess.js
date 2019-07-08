/**
 * Important! This module is only intended to be run in a native Web Worker thread.
 */

import {
  EVT_BEFORE_EXIT,
} from '../ClientProcess';
import ClientWorkerProcessCommonCore, {
  // WORKER_CTRL_IN_PIPE_NAME,
  WORKER_CTRL_OUT_PIPE_NAME,
  NATIVE_WORKER_ONLINE_MESSAGE
} from './ClientWorkerProcessCommonCore';

const nativeWorker = self;

export default class ClientWorkerProcess extends ClientWorkerProcessCommonCore {
  constructor() {
    // As this process is running natively in its own thread on the host OS,
    // it's not extending a previous ClientProcess on its own.
    // The ClientWorkerProcessController extends previous processes, and during the
    // initialization phase it will hand off the updated pid to this process.
    super(false);

    this._handleReceivedMessage = this._handleReceivedMessage.bind(this);

    // This is a native Web Worker, running in its own thread
    this._isNativeWorker = true; 
    
    // Sets to true once the main thread host controller has init
    this._isNativeWorkerHostInit = false;

    this._messageReceiverIsInit = false;
  }

  async _init() {
    try {
      this._initMessageReceiver();
      // Tell host that we're 

      await super._init();

      // TODO: Remove
      console.debug(nativeWorker);

      // Emit that native Web Worker is online
      this[WORKER_CTRL_OUT_PIPE_NAME].write({
        onlineMessage: NATIVE_WORKER_ONLINE_MESSAGE,
        serviceURI: nativeWorker.location.href
      });
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Attaches native Web Worker postMessage() handling to process lifecycle.
   */
  _initMessageReceiver() {
    if (this._messageReceiverIsInit) {
      console.warn('Message receiver has already been init');
      return;
    }

    // Native Worker addEventListener listens for postMessage() calls sent from
    // the host process
    // TODO: Use constant for 'message'
    nativeWorker.addEventListener('message',  this._handleReceivedMessage);

    // Cleanup on exit
    this.once(EVT_BEFORE_EXIT, () => {
      // TODO: Use constant for 'message'
      nativeWorker.removeEventListener('message', this._handleReceivedMessage);
    });

    this._messageReceiverIsInit = true;
  }

  _handleReceivedMessage(message) {
    console.debug('received message', message);

    // If process is not init, send messsage to pre-init

    // else, route message to stdio
    // this._routeMessage(message);

    // Current implementation below

    // TODO: Detect if not init
    /*
    if (!this._isNativeWorkerHostInit) {
      // Control message
      // this.setImmediate(() => {
      // TODO: Replace w/ setImmediate()
      // this.setImmediate(() => {
        const { data } = message;

        console.debug('received data', data);

        const { host, serializedCmd } = data;

        const { pid, options } = host;

        this._pid = pid;
        // this._options = options;

        console.debug('Executing native Web Worker command');

        // Run command in process context
        this._evalInProcessContext(serializedCmd);
      // });

    } else {
      // Route to stdio
      this._routeMessage(message);
    }
    */
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
    nativeWorker.postMessage(message, transfer);
  }

  kill(killSignal = 0) {
    // Emit to host
    this[WORKER_CTRL_OUT_PIPE_NAME].write({
      // TODO: Use constant for ctrl message
      ctrlMessage: 'kill',
      data: {
        killSignal
      }
    });

    // TODO: Verify this works
    // nativeWorker.terminate();
  }
}