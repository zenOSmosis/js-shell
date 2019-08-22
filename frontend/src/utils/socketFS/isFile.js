import { SOCKET_FS_METHOD_IS_FILE } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * @param {string} Path
 * @return {Promise<boolean>}
 */
const isFile = async (path) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_IS_FILE, path);
  } catch (exc) {
    throw exc;
  }
};

export default isFile;