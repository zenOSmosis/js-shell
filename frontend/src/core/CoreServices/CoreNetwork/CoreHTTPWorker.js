import ClientWorkerProcess from 'process/ClientWorkerProcess';

// @see https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
export default class CoreHTTPWorker extends ClientWorkerProcess {
  constructor(parentProcess) {
    super(parentProcess, (proc) => {
      console.warn('TODO: Read from control in', proc);
    });
  }
}