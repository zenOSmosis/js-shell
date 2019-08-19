import { SOCKET_FS_METHOD_MKDIR } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * @see https://nodejs.org/api/fs.html#fs_fs_mkdir_path_options_callback
 *
 * @param {string} path
 * @param {Object} options?
 * @return {Promise<void>}
 * @throws {Promise<Error>}
 */
const mkdir = async (path, options = {}) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_MKDIR, path, options);
  } catch (exc) {
    throw exc;
  }
};

export default mkdir;