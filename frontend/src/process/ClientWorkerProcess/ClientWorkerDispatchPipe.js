import {
    ClientProcessPipe,
    EVT_PIPE_DATA
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
  _clientWorkerProcess;

  constructor(clientWorkerProcess, pipeName) {
    super(clientWorkerProcess, pipeName);

    this._clientWorkerProcess = clientWorkerProcess;

    // Bind incoming messages
    // this._clientWorkerProcess.on(EVT_CLIENT_WORKER_MESSAGE, this._handleIncomingMessage);
  }

  /**
   * Automatically called when the WebWorker calls postMessage().
   * 
   * TODO: Refactor into an external routing utility.
   */
  _handleIncomingMessage = (serializedMessage) => {
    const message = JSON.parse(serializedMessage);

    const { data } = message;

    console.debug('Received incoming message data', data);

    if (data) {
      this.emit(EVT_PIPE_DATA, data);
    }
  };

  /**
   * Serializes data for transmission over wire or silicon.
   * 
   * TODO: Mate w/ _unserialize()
   * 
   * @param {any} data 
   */
  _serialize(data) {
    let serialized;
    
    switch (typeof data) {
      case 'object':
        serialized = JSON.stringify(data);
      break;

      case 'function':
        serialized = data.toString();
      break;

      case 'number':
      case 'string':
        serialized = data;
      break;

      default:
        // Leave as is
        serialized = data.toString()
      break;
    }

    return serialized;
  }

  /**
   * Overrides ClientProcessPipe's write() method w/ handling to dispatch
   * across the native Worker's postMessage() method.
   * 
   * @param {any} data 
   */
  write(data) {
    console.warn('TODO: Create uuid for message...?');

    // Notify Worker that we're writing to stdin
    this._clientWorkerProcess.postMessage(this._serialize({
      isCtrlMsg: true,
      pipeName: this._pipeName,
      isWriting: true
    }));
    
    // Write to stdin
    this._clientWorkerProcess.postMessage(this._serialize(data));

    // Notify Worker that we're done writing to stdin
    this._clientWorkerProcess.postMessage(this._serialize({
      isCtrlMsg: true,
      pipeName: this._pipeName,
      isWriting: false
    }));
  }
}