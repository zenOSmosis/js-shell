
// TODO: Get ideas from https://github.com/defunctzombie/node-process/blob/master/browser.js

// TODO: Implement automatic forking if a new process is generated inside of
// the context of another process.

import EventEmitter from 'events';
import ProcessLinkedState from 'state/ProcessLinkedState';
import ClientProcessPipe from './ClientProcessPipe';
import makeCallback from './makeCallback';

import {
  EVT_TICK,

  EVT_BEFORE_EXIT,
  EVT_EXIT,

  THREAD_TYPE_SHARED
} from './constants';

const processLinkedState = new ProcessLinkedState();

let nextPID = 0;

/**
 * ClientProcessCore, at least in API, strives to be mostly compatible w/
 * Node.js' global process object
 */
export default class ClientProcessCore extends EventEmitter {
  _base = 'ClientProcess';
  _pid = -1;
  _parentProcess = null;
  _parentPID = -1;
  _cmd = null;
  _startDate = null;
  _serviceURI = null;
  _isLaunched = false;
  _isExited = false;
  _threadType = THREAD_TYPE_SHARED;

  _stdin = null; // Pipe
  _stdout = null; // Pipe
  _stderr = null; // Pipe

  _setImmediateCallStack = [];
  _nextTickCallStack = [];

  _tickTimeout = null;

  constructor(parentProcess, cmd) {
    super();

    if (typeof parentProcess === 'undefined') {
      throw new Error('parentProcess must be set');
    } else if (parentProcess === false) {
      parentProcess = null;
    }
    this._parentProcess = parentProcess;

    if (this._parentProcess !== null) {
      this._parentPID = this._parentProcess.getPID();
    }

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

  /**
   * Postpone the execution of code until immediately after polling for I/O.
   * 
   * NOTE: This method is created as an arrow function because it's intended to
   * be used outside of the process scope (where "global" setImmediate should)
   * be mapped to this method.
   * 
   * @see http://plafer.github.io/2015/09/08/nextTick-vs-setImmediate/
   * ["Section: Putting it all together"] 
   * 
   * @see https://nodejs.org/de/docs/guides/event-loop-timers-and-nexttick/
   */
  setImmediate = async (callback, error) => {
    callback = makeCallback(this, callback);
    error = makeCallback(this, error);

    this._setImmediateCallStack.push({
      callback,
      error
    });

    this._tick();
  }

  /**
   * @see https://nodejs.org/de/docs/guides/event-loop-timers-and-nexttick/
   */
  nextTick = async (callback, error) => {
    callback = makeCallback(this, callback);
    error = makeCallback(this, error);

    this._nextTickCallStack.push({
      callback,
      error
    });

    this._tick();
  }

  _tick() {
    if (this._tickTimeout) {
      clearTimeout(this._tickTimeout);
    }

    this._tickTimeout = setTimeout(async () => {
      try {
        for (let i = 0; i < this._nextTickCallStack.length; i++) {
          const {callback, error} = this._nextTickCallStack[i];
          
          try {
            await callback();  
          } catch (exc) {
            error(exc);
          }
        }

        this._nextTickCallStack = [];

        // Execute all setImmediate()
        for (let i = 0; i < this._setImmediateCallStack.length; i++) {
          const {callback, error} = this._setImmediateCallStack[i];
          
          try {
            await callback();  
          } catch (exc) {
            error(exc);
          }
        }

        this._setImmediateCallStack = [];

        this.emit(EVT_TICK);
      } catch (exc) {
        throw exc;
      }
    }, 0);
  }

  _initDataPipes() {
    this.stdin = new ClientProcessPipe(this, 'stdin'); // TODO: Use contant for pipe name
    this.stdout = new ClientProcessPipe(this, 'stdout'); // TODO: Use contant for pipe name
    this.stderr = new ClientProcessPipe(this, 'stderr'); // TODO: Use contant for pipe name
  }

  async _launch() {
    if (this._isLaunched) {
      console.warn('Process has already launched');
      return;
    }

    console.debug(`Executing ${this.getClassName()}`, this);

    // Set monitoring flag states before execution so that they are available during execution
    this._isLaunched = true;
    processLinkedState.addProcess(this);

    try {
      if (typeof this._cmd !== 'function') {
        console.warn(
          `"cmd" is not a function, ignoring passed launch command.  If writing
          multithreaded code, anything within this class outside of this cmd
          will be run on the main thread.`
        );
        return;
      }

      await this._cmd(this);
    } catch (exc) {
      this.kill();
      throw exc;
    }
  }

  getBase() {
    return this._base;
  }

  getThreadType() {
    return this._threadType;
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

  getParentPID() {
    return this._parentPID;
  }

  getClassName() {
    return this.constructor.name;
  }

  fork() {
    throw new Error('TODO: Implement forking');
  }

  kill() {
    console.debug(`Shutting down ${this.getClassName()}`, this);

    // Tell anyone that this operation is about to complete
    this.emit(EVT_BEFORE_EXIT);

    // Clean up event handles
    this.removeAllListeners();

    // Clear from the ProcessLinkedState list
    processLinkedState.removeProcess(this);

    // Set our exit flag
    this._isExited = true;

    // Let anyone know that this operation has completed
    this.emit(EVT_EXIT);

    console.debug(`Exited ${this.getClassName()}`, this);
  }
}