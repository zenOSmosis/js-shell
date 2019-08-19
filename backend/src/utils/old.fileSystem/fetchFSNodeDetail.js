const nodeJSPath = require('path');
const stat = require('./stat');
const getPathSeparator = require('./getPathSeparator');

const pathSeparator = getPathSeparator();

const fetchFSNodeDetail = async (pathName) => {
  try {
    const path = Object.assign(
      nodeJSPath.parse(pathName),
      {
        constituents:
            pathName.trim() === pathSeparator ?
                [''] // Root directory
                :
                pathName.split(pathSeparator)
      }
    );
    const stats = await stat(pathName);
    
    let isFile = false;
    let isDir = false;
    if (stats) {
      isFile = stats.isFile();
      isDir = stats.isDirectory();
    }

    const isHidden = path.base.startsWith('.');
  
    return Object.assign(
      {
        pathName,
        path,
        isFile,
        isDir,
        isHidden,
        stats
      }
    );
  } catch (exc) {
    throw exc;
  }
};

module.exports = fetchFSNodeDetail;