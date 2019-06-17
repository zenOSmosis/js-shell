import ClientProcess, {
  THREAD_TYPE_DISTINCT,
  PIPE_NAMES,
  EVT_BEFORE_EXIT
} from '../ClientProcess';
import ClientWorkerDispatchPipe from './ClientWorkerDispatchPipe';
import evalInContext from 'utils/evalInContext';

/**
 * TODO: Remove
 * 
 * Implementation:
 * 
  const worker = new this.ClientWorkerProcess(process, (worker) => {
      worker.stdout.write('hello from worker');
  });
  worker.stdin.write('hello from client');
 */

/**
 * postMessage() protocol:
 * - first received message is the init message (automatically handled).
 * - subsequent messages routed to stdio / etc.
 * 
 * postMessage should be considered low-level and not used directly.
 */
class ClientWorker_WorkerProcess extends ClientProcess {
  constructor(parentProcess, cmd = null) {
    if (!cmd) {
      cmd = (proc) => null;
    }

    super(parentProcess, cmd);

    this._handleReceivedMessage = this._handleReceivedMessage.bind(this);

    this._threadType = THREAD_TYPE_DISTINCT;
    this._base = 'ClientWorkerProcess';
    this._idxReceivedMsg = -1;
    this._messageReceiverIsInit = false;

    this._initMessageReceiver();
  }

  _initDataPipes() {
    // Dynamic pipe allocation
    PIPE_NAMES.forEach(pipeName => {
      this[pipeName] = new ClientWorkerDispatchPipe(this, pipeName);
    });
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
    this.on(EVT_BEFORE_EXIT, () => {
      // TODO: Use constant for 'message'
      self.removeEventListener('message', this._handleReceivedMessage);
    });

    this._messageReceiverIsInit = true;
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
    self.postMessage(message, transfer);
  }

  _handleReceivedMessage(message) {
    const { data } = message;

    this._idxReceivedMsg++;

    if (this._idxReceivedMsg === 0) {
      // Control message
      // this.setImmediate(() => {
      // TODO: Replace w/ setImmediate()
      setTimeout(() => {
        this._pid = data.controller.pid;

        console.debug('Executing native Worker command');
        evalInContext(`
          const cmd = ${data.serializedCmd};

          cmd(this);
        `, this);

      }, 0);
    } else {
      // Route to stdio

      const { pipeName, data: writeData } = data;

      if (pipeName
          && this[pipeName]) {
        
        /*
        console.debug('writing', {
          pipeName,
          writeData
        });
        */
       
        this[pipeName].write(writeData);
      } else {
        console.warn('Unhandled pipe message', message);
      }
    }
  }
}

new ClientWorker_WorkerProcess(false);