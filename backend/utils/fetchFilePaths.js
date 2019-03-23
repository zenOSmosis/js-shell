const path = require('path');
const recursive = require('recursive-readdir');

/**
 * Recursively retrieves all file paths for the given types.
 *
 * @param {string} baseDirname The base directory path to search in.
 * @param {string[]} extensions File extensions to search for.
 * @return {Promise<string[]>} An array of absolute file paths which point to
 * the queried files.
 */
const fetchFilePaths = async (baseDirname, extensions = ['.desktop']) => {
  try {
    const ignoreFunc = (file) => {
      try {
        return !extensions.includes(path.extname(file));
      } catch (exc) {
        return true;
      }     
    };

    const filePaths = await (() => {
      return new Promise((resolve, reject) => {
        try {
          recursive(baseDirname, [ignoreFunc], (err, files) => {
            if (err) {
              return reject(err);
            }

            return resolve(files);
          });
        } catch (exc) {
          return reject(exc);
        }
      });
    })();

    return filePaths;
  } catch (exc) {
    throw exc;
  }
};

module.exports = fetchFilePaths;
