import { SOCKET_FS_METHOD_READDIR } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * Reads the contents of a directory.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback
 * 
 * @param {string} path
 * @param {Object} options?
 * @return {Promise<string[]>}
 */
const readdir = async (path, options = {}) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_READDIR, path, options);
  } catch (exc) {
    throw exc;
  }
};

export default readdir;