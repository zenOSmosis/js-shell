import { SOCKET_FS_METHOD_DIR_DETAIL } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

const dirDetail = async (path) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_DIR_DETAIL, path);
  } catch (exc) {
    throw exc;
  }
};

export default dirDetail;