import { SOCKET_FS_METHOD_UNLINK } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * Removes a file or symbolic link.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_unlink_path_callback
 *
 * @param {string} path 
 * @return {Promise<void>}
 * @throws {Promise<Error>}
 */
const unlink = async (path) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_UNLINK, path);
  } catch (exc) {
    throw exc;
  }
};

export default unlink;