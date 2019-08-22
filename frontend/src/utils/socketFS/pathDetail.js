import { SOCKET_FS_METHOD_PATH_DETAIL } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

const pathDetail = async (path) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_PATH_DETAIL, path);
  } catch (exc) {
    throw exc;
  }
};

export default pathDetail;