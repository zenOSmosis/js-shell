import EventEmitter from 'events';

export default class ProcessPipe extends EventEmitter {
  write(data) {
    return this.emit('data', data);
  }
}