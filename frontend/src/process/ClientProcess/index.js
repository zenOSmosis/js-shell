// TODO: Get ideas from https://github.com/defunctzombie/node-process/blob/master/browser.js

import EventEmitter from 'events';
import ProcessLinkedState from 'state/ProcessLinkedState';

export const RUN_TARGET_MAIN_THREAD = 'main-thread';
export const RUN_TARGET_WORKER_THREAD = 'worker-thread';

export const EVT_PROCESS_UPDATE = 'update';
export const EVT_PROCESS_BEFORE_EXIT = 'beforeexit';
export const EVT_PROCESS_EXIT = 'exit';

const processLinkedState = new ProcessLinkedState();

let nextPID = 0;

export default class ClientProcess extends EventEmitter {
  _runTarget = null;
  _pid = -1;
  _cmd = null;
  _parentProcess = null;
  _name = null;
  _startDate = null;
  _retain = false;
  _isExited = false;

  constructor(cmd, runTarget = RUN_TARGET_MAIN_THREAD, parentProcess = null) {
    super();

    this._cmd = cmd;

    this._runTarget = runTarget;

    this._pid = nextPID;

    // Increment up for the next process
    nextPID++;

    this._startDate = new Date();

    this._launch();
  }

  setName(name) {
    this._name = name;

    this.emit(EVT_PROCESS_UPDATE);
  }

  getName() {
    return this._name;
  }

  getStartDate() {
    return this._startDate;
  }

  /**
   * Retrieves the process identifier.
   */
  getPID() {
    return this._pid;
  }

  getClassName() {
    return this.prototype.constructor.name;
  }

  fork() {
    throw new Error('TODO: Implement forking');
  }

  retain() {
    this._isRetained = true;
  }

  async _launch() {
    processLinkedState.addProcess(this);

    console.debug('Running process', this);

    try {
      await this._cmd(this);
    } catch (exc) {
      this.kill();
      throw exc;
    }

    if (!this._isRetained) {
      this.kill();
    }
  }

  kill() {
    // Tell anyone that this operation is about to complete
    this.emit(EVT_PROCESS_BEFORE_EXIT);

    // Clean up event handles
    this.removeAllListeners();

    // Clear from the ProcessLinkedState list
    processLinkedState.removeProcess(this);

    // Set our exit flag
    this._isExited = true;

    // Let anyone know that this operation has completed
    this.emit(EVT_PROCESS_EXIT);
  }
}