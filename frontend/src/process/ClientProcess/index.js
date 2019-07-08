import {
  EVT_MESSAGE,

  EVT_READY,
  EVT_TICK,

  EVT_PIPE_DATA,

  EVT_BEFORE_EXIT,
  EVT_EXIT,

  THREAD_TYPE_MAIN,
  THREAD_TYPE_WORKER,
  THREAD_TYPES,

  PIPE_NAME_STDIN,
  PIPE_NAME_STDOUT,
  PIPE_NAME_STDERR,
  PIPE_NAME_CTRL,
  PIPE_NAMES
} from './constants';
import ClientProcess from './ClientProcess';
import ClientProcessPipe from './ClientProcessPipe';

export default ClientProcess;
export {
  EVT_MESSAGE,
  
  EVT_READY,
  EVT_TICK,

  ClientProcessPipe,
  EVT_PIPE_DATA,

  EVT_BEFORE_EXIT,
  EVT_EXIT,

  THREAD_TYPE_MAIN,
  THREAD_TYPE_WORKER,
  THREAD_TYPES,

  PIPE_NAME_STDIN,
  PIPE_NAME_STDOUT,
  PIPE_NAME_STDERR,
  PIPE_NAME_CTRL,
  PIPE_NAMES
};