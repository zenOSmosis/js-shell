import EventEmitter from 'events';

export const EVT_MESSAGE = 'message';

// TODO: Emit appropriate log level event when worker terminates

/**
 * Controls a native Worker.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
 */
export class WebWorker extends EventEmitter {
  _serviceURI = null;
  _nativeWorker = null;

  constructor(code = null) {
    super();

    if (code) {
      this._launchWithCode(code);
    }
  }

  /**
   * Launches a new native Worker with the given code.
   * 
   * @param {Function | String} code
   */
  _launchWithCode(code) {
    const { Blob, Worker } = self;

    code = code.toString();

    const blob = new Blob([code], {
      type: 'text/javascript'
    });
    const blobURL = URL.createObjectURL(blob);

    this._serviceURI = blobURL;

    this._nativeWorker = new Worker(blobURL);

    // Handle emitted messages from the worker
    this._nativeWorker.addEventListener(EVT_MESSAGE, this._handleNativeMessage);
  }

  /**
   * Handles messages emitted by the native Worker.
   */
  _handleNativeMessage = (message) => {
    console.debug('Received message from native Worker', {
      message,
      data: message.data,
      nativeWorker: this._nativeWorker
    });

    this.emit(EVT_MESSAGE, message);
  };

  /**
   * Sends a message to the native Worker's inner scope.
   * 
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
   *
   * @param {String || any} message The object to deliver to the worker; this will be in the data field in the event delivered to the DedicatedWorkerGlobalScope.onmessage handler. This may be any value or JavaScript object handled by the structured clone algorithm, which includes cyclical references.
   * @param {[] || undefined} transfer An optional array of Transferable objects to transfer ownership of. If the ownership of an object is transferred, it becomes unusable (neutered) in the context it was sent from and becomes available only to the worker it was sent to.
   * Transferable objects are instances of classes like ArrayBuffer, MessagePort or ImageBitmap objects that can be transferred. null is not an acceptable value for transfer.
   */
  postMessage(message, transfer = undefined) {
    console.debug('Sending message to native Worker', this._nativeWorker);

    this._nativeWorker.postMessage(message, transfer);
  }

  terminate() {
    this._nativeWorker.terminate();
  }

  getServiceURI() {
    return this._serviceURI;
  }

  /**
   * Alias of this.terminate().
   */
  kill() {
    this.terminate();
  }
}

const createWebWorker = (...args) => {
  return new WebWorker(...args);
};

export default createWebWorker;