import ClientProcess from '../ClientProcess';

export default class FilesystemProcess extends ClientProcess {
  constructor() {
    super(
      (proc) => {
        console.debug('Inside FileystemProcess', proc);

        console.warn('TODO: Finalize FilesystemProcess');
      }
    );
  }
}