import ClientWorkerProcess from '../ClientWorkerProcess';

export default class ClientFilesystemProcess extends ClientWorkerProcess {
  constructor(parentProcess) {
    super(
      parentProcess,
      (proc) => {
        console.debug('Inside ClientFilesystemProcess', proc);

        console.warn('TODO: Finalize FilesystemProcess');
      }
    );
  }
}