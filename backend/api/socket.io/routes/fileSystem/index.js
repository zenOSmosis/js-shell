const handleSocketRoute = require('../../utils/handleSocketRoute');
// const fs = require('fs');
const {ls, chdir, getPathSeparator} = require('../../../../utils/fileSystem');

// TODO: Move to external exports file
const FS_METHOD_GET_PATH_SEPARATOR = 'getPathSeparator';
const FS_METHOD_LS = 'ls';
const FS_METHOD_CHDIR = 'chdir';

const fileSystem = async(query = {}, ack) => {
  // TODO: Extract logic to backend/utils directory so it can be tested on its own
  return await handleSocketRoute(async () => {
    try {
      const {methodName, dirName} = query || {};
    
      switch (methodName) {
        case FS_METHOD_GET_PATH_SEPARATOR:
          return getPathSeparator();
        // break;

        case FS_METHOD_LS:
          return await ls(dirName);
        // break;

        case FS_METHOD_CHDIR:
          return await chdir(dirName);
        // break;
  
      }
    } catch (exc) {
      // TODO: Pipe this up to ack
      throw exc;
    }
  }, ack);
};

module.exports = fileSystem;