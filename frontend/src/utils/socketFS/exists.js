import { SOCKET_FS_METHOD_EXISTS } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * Test whether or not the given path exists by checking with the file system. 
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_exists_path_callback
 * 
 * @param {string} path
 * @return {Promise<boolean>} Whether or not the path exists.
 */
const exists = async (path) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_EXISTS, path);
  } catch (exc) {
    throw exc;
  }
};

export default exists;