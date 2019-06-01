import ClientProcess from '../ClientProcess';

// TODO: Expose global fs object via this (wrap an existing library for
// simplicity?)
// Provide server-side fs functions such as open, read, write, delete, etc.

/**
 * This has a weird name because it will be primarily used to interact with
 * the server's filesystem, not necessarily the client's filesystem.  However,
 * if we called if ClientFilesystemProcess, it would seem to designate this
 * as utilizing the client's filesystem directly, which is not the case.
 * 
 * We could call it ServerFilesystemProcess, but it's running on the client
 * side.
 * 
 * Call it ClientServerFilesystemProcess?
 */
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