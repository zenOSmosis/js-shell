import { SOCKET_FS_METHOD_RENAME } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * @see https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback
 * 
 * @param {string} oldPath 
 * @param {string} newPath
 * @return {Promise<void>}
 * @throws {Promise<Error>}
 */
const rename = async (oldPath, newPath) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_RENAME, oldPath, newPath);
  } catch (exc) {
    throw exc;
  }
};

export default rename;