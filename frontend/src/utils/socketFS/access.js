import { SOCKET_FS_METHOD_ACCESS } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * Tests a user's permissions for the file or directory specified by path.
 * 
 * @param {string} path 
 * @param {number} mode? Default fs.constants.F_OK
 * @return {Promise<void>}
 * @throws {Promise<Error>} 
 */
const access = async (path, mode = null) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_ACCESS, path, mode);
  } catch (exc) {
    throw exc;
  }
};

export default access;