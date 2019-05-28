// TODO!  Remove all event listeners from Pipe instances during Process shutdown cycle

// TODO: Implement automatic forking if a new process is generated inside of
// the context of another process.

// TODO: Get ideas from https://github.com/defunctzombie/node-process/blob/master/browser.js

import EventEmitter from 'events';
import ProcessLinkedState from 'state/ProcessLinkedState';
import Pipe from '../Pipe';

export const RUN_TARGET_MAIN_THREAD = 'main-thread';
export const RUN_TARGET_WORKER_THREAD = 'worker-thread';

export const EVT_PROCESS_UPDATE = 'update';
export const EVT_PROCESS_BEFORE_EXIT = 'beforeexit';
export const EVT_PROCESS_EXIT = 'exit';

const processLinkedState = new ProcessLinkedState();

let nextPID = 0;

export default class ClientProcess extends EventEmitter {
  _pid = -1;
  _cmd = null;
  _parentProcess = null;
  _name = null;
  _startDate = null;
  _serviceURI = null;
  _isLaunched = false;
  _isExited = false;

  _stdin = null; // Pipe
  _stdout = null; // Pipe
  _stderr = null; // Pipe

  constructor(cmd, parentProcess = null) {
    super();

    this._serviceURI = window.location.href;

    this._parentProcess = parentProcess;

    this._cmd = cmd;

    this._pid = nextPID;

    // Increment up for the next process
    nextPID++;

    this._startDate = new Date();

    // Provides stdin/stdout/stderr
    this._initDataPipes();

    // Automatically launch
    this._launch();
  }

  _initDataPipes() {
    this.stdin = new Pipe();
    this.stdout = new Pipe();
    this.stderr = new Pipe();
  }

  async _launch() {
    if (this._isLaunched) {
      console.warn('Process has already launched');
      return;
    }

    this._isLaunched = true;

    processLinkedState.addProcess(this);

    console.debug('Running process', this);

    try {
      await this._cmd(this);
    } catch (exc) {
      this.kill();
      throw exc;
    }
  }

  setName(name) {
    this._name = name;

    this.emit(EVT_PROCESS_UPDATE);
  }

  getName() {
    return this._name;
  }

  getServiceURI() {
    return this._serviceURI;
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
    return this.constructor.name;
  }

  fork() {
    throw new Error('TODO: Implement forking');
  }

  kill() {
    console.debug('Shutting down process', this);

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

    console.debug('Exited process', this);
  }
}