const nodeJSPath = require('path');
const stat = require('./stat');

// TODO: Can this be obtained from Node?
const DIRECTORY_SEPARATOR = nodeJSPath.sep;

const fetchFSNodeDetail = async (pathName) => {
  try {
    const path = Object.assign(
      nodeJSPath.parse(pathName),
      {
        constituents:
            pathName.trim() === DIRECTORY_SEPARATOR ?
                [''] // Root directory
                :
                pathName.split(DIRECTORY_SEPARATOR)
      }
    );
    const stats = await stat(pathName);
    
    let isFile = false;
    let isDir = false;
    if (stats) {
      isFile = stats.isFile();
      isDir = stats.isDirectory();
    }
  
    return Object.assign(
      {
        pathName,
        path,
        isFile,
        isDir,
        stats
      }
    );
  } catch (exc) {
    throw exc;
  }
};

module.exports = fetchFSNodeDetail;