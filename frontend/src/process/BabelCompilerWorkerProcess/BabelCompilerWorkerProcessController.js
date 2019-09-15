import ClientWorkerProcessController from '../ClientWorkerProcess';

/**
 * Main-threaded controller for the BabelCompilerWorkerProcess.
 * 
 * @extends ClientWorkerProcessController
 */
class BabelCompilerWorkerProcessController extends ClientWorkerProcessController {
  constructor(parentProcess, cmd = null, options = {}) {
    // Default options
    const defOptions = {
      // The non-instantiated class of the Worker implementation
      DispatchWorker: new Worker('./dispatch.worker.js', { type: 'module' }),
    };

    options = {...defOptions, ...options};

    super(parentProcess, cmd, options);
  }
}

export default BabelCompilerWorkerProcessController;