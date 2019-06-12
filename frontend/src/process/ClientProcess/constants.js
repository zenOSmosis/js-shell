export const PIPE_NAME_STDIN = 'stdin';
export const PIPE_NAME_STDOUT = 'stdout';
export const PIPE_NAME_STDERR = 'stderr';
export const PIPE_NAMES = [
  PIPE_NAME_STDIN,
  PIPE_NAME_STDOUT,
  PIPE_NAME_STDERR
];

export const EVT_PIPE_DATA = 'data';

export const EVT_TICK = 'tick';

export const EVT_BEFORE_EXIT = 'beforeexit';
export const EVT_EXIT = 'exit';

export const THREAD_TYPE_SHARED = 'shared';
export const THREAD_TYPE_DISTINCT = 'distinct';
export const THREAD_TYPES = [
  THREAD_TYPE_SHARED,
  THREAD_TYPE_DISTINCT
];