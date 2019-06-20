import {
  EVT_BEFORE_EXIT,
} from '../ClientProcess';
import ClientWorkerProcessCommonCore from './ClientWorkerProcessCommonCore';
import evalInContext from 'utils/evalInContext';

/**
 * The ClientWorkerProcess.worker class, which runs directly in a native
 * Worker.
 * 
 * postMessage() protocol:
 * - first received message is the init message (automatically handled).
 * - subsequent messages routed to stdio / etc.
 * 
 * postMessage should be considered low-level and not used directly.
 */
class ClientWorker_WorkerProcess extends ClientWorkerProcessCommonCore {
  constructor(parentProcess, cmd = null) {
    if (!cmd) {
      cmd = (proc) => null;
    }

    super(parentProcess, cmd);

    this._handleReceivedMessage = this._handleReceivedMessage.bind(this);
    
    this._idxReceivedMsg = -1;
    this._messageReceiverIsInit = false;

    this._initMessageReceiver();
  }

  /**
   * Dynamically attaches self.postMessage() handling to process lifecycle.
   */
  _initMessageReceiver() {
    if (this._messageReceiverIsInit) {
      console.warn('Message receiver has already been init');
      return;
    }

    // TODO: Use constant for 'message'
    self.addEventListener('message',  this._handleReceivedMessage);

    // Cleanup
    this.once(EVT_BEFORE_EXIT, () => {
      // TODO: Use constant for 'message'
      self.removeEventListener('message', this._handleReceivedMessage);
    });

    this._messageReceiverIsInit = true;
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
    self.postMessage(message, transfer);
  }

  _handleReceivedMessage(message) {
    this._idxReceivedMsg++;

    if (this._idxReceivedMsg === 0) {
      // Control message
      // this.setImmediate(() => {
      // TODO: Replace w/ setImmediate()
      setTimeout(() => {
        const { data } = message;

        this._pid = data.controller.pid;

        console.debug('Executing native Worker command');

        // TODO: Route setImmediate() as a "global" for the executed scripting
        evalInContext(`
          const cmd = ${data.serializedCmd};

          cmd(this);
        `, this);

      }, 0);
    } else {
      // Route to stdio
      this._routeMessage(message);
    }
  }

  async kill(killSignal = 0) {
    console.warn('Route kill() up to parent process');
  }
}

new ClientWorker_WorkerProcess(false);