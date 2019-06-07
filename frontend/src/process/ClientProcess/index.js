import ClientProcessNext from './ClientProcessNext';

export default ClientProcessNext;

// Can we dyanmically export using a loop?

export const RUN_TARGET_MAIN_THREAD = 'main-thread';
export const RUN_TARGET_WORKER_THREAD = 'worker-thread';

// TODO: Rename to EVT_PROCESS_TICK(?)
export const EVT_PROCESS_UPDATE = 'update';

export const EVT_PROCESS_BEFORE_EXIT = 'beforeexit';
export const EVT_PROCESS_EXIT = 'exit';
export const EVT_PROCESS_HEARTBEAT = 'heartbeat';

export const PROCESS_THREAD_TYPE_SHARED = 'shared';
export const PROCESS_THREAD_TYPE_DISTINCT = 'distinct';
export const PROCESS_THREAD_TYPES = [
  PROCESS_THREAD_TYPE_SHARED,
  PROCESS_THREAD_TYPE_DISTINCT
];