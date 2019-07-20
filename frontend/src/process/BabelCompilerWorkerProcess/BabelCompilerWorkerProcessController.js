import ClientWorkerProcessController from '../ClientWorkerProcess';
import BabelCompilerWorkerProcess from './dispatch.worker';

export default class BabelCompilerWorkerProcessController extends ClientWorkerProcessController {
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