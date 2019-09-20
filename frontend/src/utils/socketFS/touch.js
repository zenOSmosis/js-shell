import { SOCKET_FS_METHOD_TOUCH } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * Creates an empty file.
 * 
 * @param {string} path 
 * @return {Promise<void>}
 * @throws {Promise<Error>}
 */
const touch = async (path) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_TOUCH, path);
  } catch (exc) {
    throw exc;
  }
};

export default touch;