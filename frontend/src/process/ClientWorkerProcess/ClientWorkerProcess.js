/**
 * Important! This module is only intended to be run in a native Web Worker thread.
 */

import {
  EVT_BEFORE_EXIT,
} from '../ClientProcess';
import ClientWorkerProcessCommonCore from './ClientWorkerProcessCommonCore';

const nativeWorker = self;

export default class ClientWorkerProcess extends ClientWorkerProcessCommonCore {
  constructor() {
    // As this process is running natively in its own thread on the host OS,
    // it's not extending a previous ClientProcess on its own.
    // The ClientWorkerProcessController extends previous processes, and during the
    // initialization phase it will hand off the updated pid to this process.
    super(false);

    // This is a native Web Worker, running in its own thread
    this._isNativeWorker = true;

    this._serviceURI = (() => {
      if (nativeWorker.location) {
        return nativeWorker.location.href;
      } else {
        console.warn('Unable to obtain Web Worker location');
        return 'N/A';
      }
    })();
    
    // Sets to true once the main thread host controller has init
    this._isNativeWorkerHostInit = false;

    this._messageReceiverIsInit = false;
  }

  async _init() {
    try {
      this._initMessageReceiver();

      await super._init();
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
    nativeWorker.addEventListener('message',  this._routeMessage);

    // Cleanup on exit
    this.once(EVT_BEFORE_EXIT, () => {
      // TODO: Use constant for 'message'
      nativeWorker.removeEventListener('message', this._routeMessage);
    });

    this._messageReceiverIsInit = true;
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
    this.stdctrl.write({
      // TODO: Use constant for ctrl message
      ctrlMessage: 'kill',
      ctrlData: {
        killSignal
      }
    });

    // TODO: Verify this works
    // nativeWorker.terminate();
  }
}