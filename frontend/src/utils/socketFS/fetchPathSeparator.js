import { SOCKET_FS_METHOD_FETCH_PATH_SEPARATOR } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * @return {Promise<string>}
 */
const fetchPathSeparator = async () => {
  try {
    return socketFSCall(SOCKET_FS_METHOD_FETCH_PATH_SEPARATOR);
  } catch (exc) {
    throw exc;
  }
};

export default fetchPathSeparator;