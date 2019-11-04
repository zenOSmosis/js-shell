import pathLib from 'path';
import stat from './stat';
import fetchPathSeparator from './fetchPathSeparator';
import readdir from './readdir';
import mime from 'mime';

const KIND_FILE = 'File';
const KIND_DIR = 'Directory';
const KIND_UNKNOWN = '?';

// TODO: Document output
const pathDetail = async (path) => {
  try {
    const pathSeparator = await fetchPathSeparator();

    // Normalize path
    path = path.toString().trim();
    // Remove trailing slash
    if (path.length > 1 &&
      path[path.length - 1] === pathSeparator) {
      path.slice(0, -1);
    }
    // Replace double-occurrences of path separator w/ single
    path = path.replace(new RegExp(pathSeparator + pathSeparator), pathSeparator);

    const stats = await stat(path);

    /**
    * @type {PathParse}
    */
    const parsedPath = pathLib.parse(path);

    const constituents =
      path === pathSeparator ?
        [''] // Root directory
        :
        path.split(pathSeparator);

    let isFile = false;
    let isDir = false;
    if (stats) {
      isFile = stats.isFile();
      isDir = stats.isDirectory();
    }

    // A user-friendly, string representation of the path type
    let kind = (isFile ? KIND_FILE : isDir ? KIND_DIR : KIND_UNKNOWN);

    let children = [];
    if (isDir) {
      children = await readdir(path);
    }

    // Unix[-like] only
    const isHidden = parsedPath.base.startsWith('.');
    const parent = parsedPath.dir !== path ? parsedPath.dir : null;

    const mimeType = mime.getType(path);

    return {
      children,
      constituents,
      mimeType,
      parent,
      path,
      ...parsedPath,
      isFile,
      isDir,
      kind,
      isHidden,
      stats
    };
  } catch (exc) {
    throw exc;
  }
};

export default pathDetail;