import { SOCKET_FS_METHOD_RM } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

const rm = async (path) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_RM, path);
  } catch (exc) {
    throw exc;
  }
};

export default rm;