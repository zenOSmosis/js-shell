import { SOCKET_FS_METHOD_CLOSE } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * Asynchronous close.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_close_fd_callback
 * @see http://man7.org/linux/man-pages/man2/close.2.html
 * 
 * @param {number} fd
 * @return {Promise<void>}
 * @throws {Promise<Error>}
 */
const close = async (fd) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_CLOSE, fd);
  } catch (exc) {
    throw exc;
  }
};

export default close;