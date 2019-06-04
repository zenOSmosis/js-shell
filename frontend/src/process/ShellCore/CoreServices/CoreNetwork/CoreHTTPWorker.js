import ClientWorkerProcess from 'process/ClientWorkerProcess';

export default class CoreHTTPWorker extends ClientWorkerProcess {
  constructor(parentProcess) {
    super(parentProcess, (proc) => {
      console.warn('TODO: Read from control in', proc);
    });
  }
}