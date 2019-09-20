import { SOCKET_FS_METHOD_WRITE } from 'shared/socketFS/socketFS.constants';
import 'shared/socketFS/socketFS.typedefs';
import socketFSCall from './_socketFSCall';

/**
 * Write buffer to the file specified by fd.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback
 * 
 * @param {number} fd
 * @param {Buffer | TypedArray | DataView} buffer The buffer that the data will
 * be written from.
 * @param {number} offset Determines the part of the buffer to be written.
 * @param {number} length An integer specifying the number of bytes to write.
 * @param {number} position? Specifies where to begin reading from in the file.
 * If position is null, data will be written from the current file position, and
 * the file position will be updated. If position is an integer, the file
 * position will remain unchanged.
 * @return {Promise<[bytesWritten: number, buffer: Buffer | TypedArray | DataView]>}
 * @throws {Promise<Error>}
 */
const write = async (fd, buffer, offset, length, position = null) => {
  try {
    return await socketFSCall(SOCKET_FS_METHOD_WRITE, fd, buffer, offset, length, position);
  } catch (exc) {
    throw exc;
  }
};

export default write;