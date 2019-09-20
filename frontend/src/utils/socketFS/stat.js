import { SOCKET_FS_METHOD_STAT } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * @see https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback
 * 
 * @param {string} path 
 * @param {Object} options?
 * @return {Promise<FSStats>}
 * @throws {Promise<Error>}
 */
const stat = async (path) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_STAT, path);
  } catch (exc) {
    throw exc;
  }
};

export default stat;