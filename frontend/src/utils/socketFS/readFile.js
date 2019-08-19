import { SOCKET_FS_METHOD_READFILE } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * Reads the contents of a file.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
 * 
 * @param {string} path
 * @param {Object} options?
 * @return {Promise<string | Buffer>}
 */
const readFile = async (path, options = {}) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_READFILE, path, options);
  } catch (exc) {
    throw exc;
  }
};

export default readFile;