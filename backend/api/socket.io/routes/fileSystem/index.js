const handleSocketRoute = require('../../utils/handleSocketRoute');
const fs = require('fs');

// TODO: Move to external exports file
const FS_METHOD_LS = 'ls';

const fileSystem = async(query = {}, ack) => {
  // TODO: Extract logic to backend/utils directory so it can be tested on its own
  return await handleSocketRoute(async () => {
    try {
      const {methodName, options} = query;
  
      const {dirName} = options;
  
      switch (methodName) {
        case FS_METHOD_LS:
          fs.readdir(dirName, (err, files) => {
            if (err) {
              throw err;
            }
  
            return files;
  
            /*
            files.forEach(file => {
              console.log(file);
            });
            */
          });
        break;
  
      }
    } catch (exc) {
      // TODO: Pipe this up to ack
      throw exc;
    }
  }, ack);
};

module.exports = fileSystem;