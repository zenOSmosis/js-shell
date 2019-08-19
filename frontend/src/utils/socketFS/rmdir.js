import { SOCKET_FS_METHOD_RMDIR } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * Removes a directory.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_rmdir_path_callback
 * 
 * @param {string} path
 * @return {Promise<void>}
 * @throws {Promise<Error>}
 */
const rmdir = async (path) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_RMDIR, path);
  } catch (exc) {
    throw exc;
  }
};

export default rmdir;