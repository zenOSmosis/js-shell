import Pipe from '../Pipe';
import { EVT_PROCESS_BEFORE_EXIT } from '../ClientProcess';

export const EVT_PIPE_DATA = 'data';

// Important! Leave as 'message' for native Worker
export const EVT_CLIENT_WORKER_MESSAGE = 'message';

/**
 * Adapts Pipe to work with native Worker.
 * 
 * It acts as a router for the native Worker's postMessage() and 'message'
 * events handling.
 */
export default class ClientWorkerDispatchPipe extends Pipe {
  _clientWorkerProcess = null;
  _pipeName = '';

  constructor(clientWorkerProcess, pipeName) {
    super();

    this._clientWorkerProcess = clientWorkerProcess;
    this._pipeName = pipeName;

    // Bind incoming messages
    this._clientWorkerProcess.on(EVT_CLIENT_WORKER_MESSAGE, this._handleIncomingMessage);

    // Remove all listeners before the process exits
    this._clientWorkerProcess.on(EVT_PROCESS_BEFORE_EXIT, () => {
      console.debug('Removing all listeners', this);
      this.removeAllListeners();
    });
  }

  /**
   * Automatically called when the WebWorker calls postMessage.
   */
  _handleIncomingMessage = (serializedMessage) => {
    const message = JSON.parse(serializedMessage);

    const { data } = message;

    console.debug('Received incoming message data', data);

    if (data) {
      this.emit(EVT_PIPE_DATA, data);
    }
  };

  write(data) {
    // Writes the data as a serialized data object
    // TODO: Handle data serialization better
    const serializedMessage = data.toString();

    this._clientWorkerProcess.postMessage(`use-pipe:${this._pipeName}`);
    this._clientWorkerProcess.postMessage(serializedMessage);
  }
}