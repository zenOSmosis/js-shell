import { SOCKET_FS_METHOD_IS_DIR } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * @return {Promise<boolean>}
 */
const isDir = async (path) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_IS_DIR, path);
  } catch (exc) {
    throw exc;
  }
};

export default isDir;