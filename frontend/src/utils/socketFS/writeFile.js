import { SOCKET_FS_METHOD_WRITEFILE } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * Writes data to the file, replacing the file if it already exists. data can
 * be a string or a buffer.
 * 
 * Note, thie eoncoding option is ignored if data is a buffer.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
 * 
 * @param {string} file Filename or file descriptor.
 * @param {string | Buffer | TypedArray | DataView} data
 * @param {Object} options?
 * @return {Promise<void>}
 * @throws {Promise<Error>}
 */
const writeFile = async (file, data, options = {}) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_WRITEFILE, file, data, options);
  } catch (exc) {
    throw exc;
  }
};

export default writeFile;