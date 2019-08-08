// Important! These pipe names also represent ClientProcess class properties.
// If changing a value here, the relevant class property name should be changed
// as well.
export const PIPE_NAME_STDIN = 'stdin';
export const PIPE_NAME_STDOUT = 'stdout';
export const PIPE_NAME_STDERR = 'stderr';
export const PIPE_NAME_STDCTRL = 'stdctrl';
export const PIPE_NAMES = [
  PIPE_NAME_STDIN,
  PIPE_NAME_STDOUT,
  PIPE_NAME_STDERR,
  PIPE_NAME_STDCTRL
];

export const EVT_PIPE_DATA = 'data';
export const EVT_PIPE_END = 'end';

export const EVT_READY = 'ready';
export const EVT_TICK = 'tick';

export const EVT_BEFORE_EXIT = 'beforeExit';
export const EVT_EXIT = 'exit';

//export const EVT_WINDOW_RESIZE = 'window_resize';

export const EVT_STATE_UPDATE = 'stateUpdate';

// Typically used for IPC w/ native Web Workers
export const EVT_MESSAGE = 'message';

export const THREAD_TYPE_MAIN = 'main';
export const THREAD_TYPE_WORKER = 'worker';
export const THREAD_TYPES = [
  THREAD_TYPE_MAIN,
  THREAD_TYPE_WORKER
];