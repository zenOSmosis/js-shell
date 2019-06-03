import ClientWorkerProcess from '../ClientWorkerProcess';

export default class CoreHTTPWorker extends ClientWorkerProcess {
  constructor(parentProcess) {
    super(parentProcess, (proc) => {
      console.debug('Hello from CoreHTTPWorker!', proc);
    });
  }
}