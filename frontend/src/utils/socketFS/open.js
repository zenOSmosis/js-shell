import { SOCKET_FS_METHOD_OPEN } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * Asynchronous file open.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback
 * @see http://man7.org/linux/man-pages/man2/open.2.html
 * 
 * @param {string} path
 * @param {string} flags?
 * @param {number} mode
 * @return {Promise<number>} Resolves a numerical file descriptor for other
 * file operations.
 * @throws {Promise<Error>}
 */
const open = async (path, flags = null, mode = null) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_OPEN, path, flags, mode);
  } catch (exc) {
    throw exc;
  }
};

export default open;