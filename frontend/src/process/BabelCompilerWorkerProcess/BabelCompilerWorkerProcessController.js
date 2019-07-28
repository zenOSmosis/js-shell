import ClientWorkerProcessController from '../ClientWorkerProcess';
import BabelCompilerWorkerProcess from './dispatch.worker';

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
      DispatchWorker: BabelCompilerWorkerProcess,
    };

    options = {...defOptions, ...options};

    super(parentProcess, cmd, options);
  }
}

export default BabelCompilerWorkerProcessController;