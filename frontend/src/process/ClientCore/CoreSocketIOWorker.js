import ClientWorkerProcess from '../ClientWorkerProcess';

export default class CoreSocketIOWorker extends ClientWorkerProcess {
  constructor(parentProcess) {
    super(parentProcess, (proc) => {
      console.debug('Hello from CoreSocketIOWorker!', proc);
    });
  }
}