import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';
import {
  getPathSeparator,
  isDir,
  isFile,
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  rmdir,
  stat,
  touch,
  unlink,
  writeFile
} from 'utils/socketFS';
import 'utils/socketFS/shared/socketFS.typedefs';
import {
  SOCKET_FS_METHOD_FETCH_PATH_SEPARATOR,
  SOCKET_FS_METHOD_IS_DIR,
  SOCKET_FS_METHOD_IS_FILE,
  SOCKET_FS_METHOD_MKDIR,
  SOCKET_FS_METHOD_READDIR,
  SOCKET_FS_METHOD_READFILE,
  SOCKET_FS_METHOD_RENAME,
  SOCKET_FS_METHOD_RM,
  SOCKET_FS_METHOD_RMDIR,
  SOCKET_FS_METHOD_STAT,
  SOCKET_FS_METHOD_TOUCH,
  SOCKET_FS_METHOD_UNLINK,
  SOCKET_FS_METHOD_WRITEFILE
} from 'utils/socketFS/shared/socketFS.constants';

const socketFS = async (options = {}, ack) => {
  return await handleSocketAPIRoute(async () => {
    try {
      const { socketFSMethod, socketFSArgs: optsSocketFSArgs } = options;
      if (!socketFSMethod) {
        throw new Error('No socketFSMethod specified');
      }
      const socketFSArgs = optsSocketFSArgs ? optsSocketFSArgs : [];

      switch (socketFSMethod) {
        case SOCKET_FS_METHOD_FETCH_PATH_SEPARATOR:
          return getPathSeparator(...socketFSArgs);
        
        case SOCKET_FS_METHOD_IS_DIR:
          return await isDir(...socketFSArgs);
        
        case SOCKET_FS_METHOD_IS_FILE:
          return await isFile(...socketFSArgs);
        
        case SOCKET_FS_METHOD_MKDIR:
          return await mkdir(...socketFSArgs);
        
        case SOCKET_FS_METHOD_READDIR:
          return await readdir(...socketFSArgs);
        
        case SOCKET_FS_METHOD_READFILE:
          return await readFile(...socketFSArgs);

        case SOCKET_FS_METHOD_RENAME:
          return await rename(...socketFSArgs);
        
        case SOCKET_FS_METHOD_RM:
          return await rm(...socketFSArgs);
        
        case SOCKET_FS_METHOD_RMDIR:
          return await rmdir(...socketFSArgs);
        
        case SOCKET_FS_METHOD_STAT:
          return await stat(...socketFSArgs);
        
        case SOCKET_FS_METHOD_TOUCH:
          return await touch(...socketFSArgs);
        
        case SOCKET_FS_METHOD_UNLINK:
          return await unlink(...socketFSArgs);
        
        case SOCKET_FS_METHOD_WRITEFILE:
          return await writeFile(...socketFSArgs);
        
        default:
          throw new Error(`Unknown socketFSMethod: ${socketFSMethod}`);
      }

    } catch (exc) {
      throw exc;
    }
  }, ack);
};

export default socketFS;