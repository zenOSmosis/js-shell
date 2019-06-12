import {
  EVT_TICK,

  EVT_PIPE_DATA,

  EVT_BEFORE_EXIT,
  EVT_EXIT,

  THREAD_TYPE_SHARED,
  THREAD_TYPE_DISTINCT,
  THREAD_TYPES,

  PIPE_NAME_STDIN,
  PIPE_NAME_STDOUT,
  PIPE_NAME_STDERR,
  PIPE_NAMES
} from './constants';
import ClientProcessNext from './ClientProcessNext';
import ClientProcessPipe from './ClientProcessPipe';

export default ClientProcessNext;
export {
  EVT_TICK,

  ClientProcessPipe,
  EVT_PIPE_DATA,

  EVT_BEFORE_EXIT,
  EVT_EXIT,

  THREAD_TYPE_SHARED,
  THREAD_TYPE_DISTINCT,
  THREAD_TYPES,

  PIPE_NAME_STDIN,
  PIPE_NAME_STDOUT,
  PIPE_NAME_STDERR,
  PIPE_NAMES
};