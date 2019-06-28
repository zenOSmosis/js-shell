import {
    ClientProcessPipe,
    // EVT_PIPE_DATA
} from '../ClientProcess';

// Important! Leave as 'message' for native Worker
export const EVT_CLIENT_WORKER_MESSAGE = 'message';

/**
 * Adapts Pipe to work with native Worker.
 * 
 * It acts as a router for the native Worker's postMessage() and 'message'
 * events handling.
 */
export default class ClientWorkerDispatchPipe extends ClientProcessPipe {
  /**
   * Overrides ClientProcessPipe's write() method w/ handling to dispatch
   * across the native Worker's postMessage() method.
   * 
   * @param {any} data 
   * @param {object[]} transfer (optional) An optional array of Transferable
   * objects to transfer ownership of. If the ownership of an object is
   * transferred, it becomes unusable (neutered) in the context it was sent
   * from and becomes available only to the worker it was sent to. Transferable
   * objects are instances of classes like ArrayBuffer, MessagePort or
   * ImageBitmap objects that can be transferred. null is not an acceptable
   * value for transfer.
   */
  write(data, transfer = []) {
    const pipeName = this._pipeName;

    const message = {
      pipeName,
      data
    };
    
    this._clientProcess.postMessage(message, transfer);
  }
}