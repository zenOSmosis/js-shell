/**
 * Simple testing to ensure "this" executes within relevant process scope
 */

const { ClientProcess, ClientWorkerProcess } = this;

new ClientProcess(process, (proc) => {
  const proc_pid = proc.getPID();
  const this_pid = this.getPID();

  if (proc_pid === this_pid) {
    console.debug('PIDs match!', this);
  } else {
    throw new Error('this is not executing in process scope!');
  }

  const self_setImmediate = setImmediate.toString();
  const proc_setImmediate = proc.setImmediate.toString();
  const this_setImmediate = this.setImmediate.toString();

  if (self_setImmediate === proc_setImmediate &&
      self_setImmediate === this_setImmediate) {
    console.debug('setImmediate is properly routed');
  } else {
    throw new Error('setImmediate is not properly routed');
  }
});

new ClientWorkerProcess(process, (proc) => {
  const proc_pid = proc.getPID();
  const this_pid = this.getPID();

  if (proc_pid === this_pid) {
    console.debug('PIDs match!', this);
  } else {
    throw new Error('this is not executing in process scope!');
  }

  const self_setImmediate = setImmediate.toString();
  const proc_setImmediate = proc.setImmediate.toString();
  const this_setImmediate = this.setImmediate.toString();

  if (self_setImmediate === proc_setImmediate &&
      self_setImmediate === this_setImmediate) {
    console.debug('setImmediate is properly routed');
  } else {
    throw new Error('setImmediate is not properly routed');
  }
});