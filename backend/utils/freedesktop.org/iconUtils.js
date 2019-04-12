// Freedesktop icon files
// @see https://wiki.archlinux.org/index.php/icons

// TODO: Use current theme

const path = require('path');
const fetchRecursiveFilePaths = require('../fileSystem/fetchRecursiveFilePaths');

const config = require('../../config');

const fetchAllParsedIconPaths = async (readDirectories = config.FREEDESKTOP_ICON_READ_DIRECTORIES) => {
  try {
    let parsedIconPaths = [];

    for (let i = 0; i < readDirectories.length; i++) {
      const dir = readDirectories[i];
  
      const dirPaths = await fetchRecursiveFilePaths(dir, config.FREEDESKTOP_ICON_FILE_EXTENSIONS);
  
      dirPaths.forEach((dirPath) => {
        parsedIconPaths.push(dirPath);
      });
    }

    // Path part display resolution pattern (e.g. .../256x256/... => 256x256)
    const resPattern = /[0-9]\d+x[0-9]\d+/gm;

    parsedIconPaths = parsedIconPaths.map(parsedIconPath => {
      parsedIconPath = path.parse(parsedIconPath);

      // Derive resolution from path parts
      // Note, this assumes that the filesystem contains the proper resolution
      // for each icon, and does not inspect the images themselves
      parsedIconPath.resolution = null;
      parsedIconPath.width = null;
      parsedIconPath.height = null;
      const dirParts = parsedIconPath['dir'].split('/');
      dirParts.forEach((pathPart) => {
        if (resPattern.test(pathPart)) {
          parsedIconPath.resolution = pathPart;

          // Derive width / height from path part
          const parsedRes = parsedIconPath.resolution.split('x');
          parsedIconPath.width = parseInt(parsedRes[0]);
          parsedIconPath.height = parseInt(parsedRes[1]);
        }
      });

      parsedIconPath.fullPath = `${parsedIconPath.dir}/${parsedIconPath.base}`;

      return parsedIconPath;
    });

    return parsedIconPaths;
  } catch (exc) {
    throw exc;
  }
};

const fetchIconPath = (() => {
  let cachedParsedIconPaths = [];

  return async (iconName, useCache = true, readDirectories = config.FREEDESKTOP_ICON_READ_DIRECTORIES) => {
    try {
      const isAbsolute = path.isAbsolute(iconName);
      if (isAbsolute) {
        return iconName;
      }

      // Fetch all icon paths if not using cache, or cache is not populated
      if (!useCache || !cachedParsedIconPaths.length) {
        cachedParsedIconPaths = await fetchAllParsedIconPaths(readDirectories);
      }

      const relevantParsedIconPaths = cachedParsedIconPaths.filter((parsedIconPath) => {
        return parsedIconPath['name'].toUpperCase() == iconName.toUpperCase();
      });

      if (!relevantParsedIconPaths.length) {
        return null;
      }

      const bestParsedIconPath = relevantParsedIconPaths.reduce((a, b) => {
        // Vector images take priority
        if (a.ext == '.svg') {
          return a;
        } else if (b.ext == '.svg') {
          return b;

          // Larger resolution images take second priority
        } else if (a.width > b.width) {
          return a;
        } else {
          return b;
        }
      });

      return bestParsedIconPath['fullPath'];
    } catch (exc) {
      throw exc;
    }
  };
})();

module.exports = {
  fetchAllParsedIconPaths,
  fetchIconPath
};