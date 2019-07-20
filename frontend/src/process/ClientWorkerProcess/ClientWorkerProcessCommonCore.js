
import ClientProcess, {
  EVT_PIPE_DATA,
  THREAD_TYPE_WORKER,
  PIPE_NAMES
} from '../ClientProcess';
import ClientWorkerDispatchPipe from './ClientWorkerDispatchPipe';
import createClientWorkerInitProcess from './ClientWorkerInitProcess/createClientWorkerInitProcess';
import serialize, { deserialize } from 'utils/serialize';

export const CTRL_NAME_SET_OPTIONS = 'setOptions';

/**
 * Common class which ClientWorkerProcess and ClientWorkerProcessController
 * extend from.
 */
export default class ClientWorkerProcessCommonCore extends ClientProcess {
  constructor(...args) {
    super(...args);

    this._threadType = THREAD_TYPE_WORKER;
    this._isNativeWorker = null;

    // Initialized in _init, this sub-process authenticates the native Web Worker
    // with the ClientWorkerProcessController controller
    this._clientWorkerInitProcess = null;

    // Run through next tick...
    this.setImmediate(() => {
      // ... and ensure _isNativeWorker has been set
      // The _isNativeWorker won't be immediately present when instantiating this
      // class, so this check must be performed on the next tick.
      if (this._isNativeWorker === null) {
        throw new Error('_isNativeWorker property must be set by class extension');
      }
    });
  }

  /**
   * Called by the super ClientProcess.
   */
  async _init() {
    try {
      this._initOptionsReceiver();

      /**
       * Await for init process to initially sync the Web Worker to the controller.
       * Important! createClientWorkerInitProcess must be run in _init()
       * instead of in the constructor so that class extensions can utilize it.
       */
      this._clientWorkerInitProcess = createClientWorkerInitProcess(this);
      await this._clientWorkerInitProcess.onceReady();

      // Initialize super process
      await super._init();
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * @return {boolean} If true: Web Worker. If false: controller (main thread)
   */
  getIsNativeWorker() {
    if (this._isNativeWorker === null) {
      throw new Error('isWorker has not been set, or is not ready to be used');
    } else {
      return this._isNativeWorker;
    }
  }

  setOptions(options = {}, useCtrl = true) {
    if (useCtrl) {
      this.stdctrl.write({
        ctrlName: 'setOptions',
        ctrlData: serialize(options)
      });
    }

    super.setOptions(options);

    console.debug(`set ${this._isNativeWorker ? 'Web Worker' : 'controller'} options`, this.getOptions());
  }

  /**
   * Utilized to set instructions for the Web Worker and the host
   * controller in a centralized location.
   * 
   * Important!  This does not dynamically set instructions during run-time,
   * only during compilation.
   * 
   * @param {object} commands All commands are currently optional.
   * @return {Promise<void>} Resolves once the respective command, depending on
   * environment (Web Worker or main-threaded controller), is run.
   */
  async setDualCommand(commands = { workerCommand: null, controllerCommand: null }) {
    try {
      const { workerCommand, controllerCommand } = commands;

      // DETERMINE IF CLIENT WORKER IS HOST OR NATIVE
      switch (this.getIsNativeWorker()) {
        case true:
          // Web Worker
  
          if (typeof workerCommand === 'function') {
            await workerCommand();
          }
        break;
  
        case false:
          // Controller (Main thread)
          
          if (typeof controllerCommand === 'function') {
            await controllerCommand();
          }
        break;
  
        default:
          throw new Error('getIsNativeWorker() returned an unhandled value');
      }
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * @override
   * 
   * Important! We're overriding (thus, not calling) the super implementation here.
   */
  _initDataPipes() {
    // Dynamic pipe allocation
    PIPE_NAMES.forEach(pipeName => {
      this[pipeName] = new ClientWorkerDispatchPipe(this, pipeName);
    });
  }

  // TODO: Utilize w/ _routeMessage; refactor to perform trapping here
  _initOptionsReceiver() {
    this.stdctrl.on(EVT_PIPE_DATA, (data) => {
      const { ctrlName } = data;

      if (ctrlName === CTRL_NAME_SET_OPTIONS) {
        const {ctrlData: options } = data;

        this.setOptions(deserialize(options), false);
      }
    });
  }

  /**
   * Routes messages received via postMessage() calls from the process host to
   * this process stdio.
   * 
   * @param {any} message
   */
  _routeMessage = (message) => {
    const { data } = message;
      
    // Route to stdio
    const { pipeName, data: writeData } = data;

    // TODO: Handle (and trap) private stdctrl messages.  Not all messages will
    // be private.  Route the ones which are not private up to public stdctrl.

    if (pipeName && this[pipeName]) {
      // Write local (don't use pipe.write() as it sends as postMessage())
      this[pipeName].emit(EVT_PIPE_DATA, writeData);
    } else {
      console.warn('Unhandled pipe message', message);
    }
  }
}