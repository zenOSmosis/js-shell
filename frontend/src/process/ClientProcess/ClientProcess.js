// TODO: Separate ClientProcess from ClientProcessCore (and extend w/ ClientWorker_WorkerProcess).

// TODO: Remove direct LinkedState usage from base ClientProcessCore (use in
// extension)

// TODO: Get ideas from https://github.com/defunctzombie/node-process/blob/master/browser.js

import EventEmitter from 'events';
import ProcessLinkedState from 'state/ProcessLinkedState';
import ClientProcessPipe from './ClientProcessPipe';
import makeCallback from './makeCallback';

import {
  EVT_READY,
  EVT_TICK,

  EVT_BEFORE_EXIT,
  EVT_EXIT,

  THREAD_TYPE_SHARED,

  PIPE_NAME_STDIN,
  PIPE_NAME_STDOUT,
  PIPE_NAME_STDERR
} from './constants';

const processLinkedState = new ProcessLinkedState();

let nextPID = 0;

/**
 * TODO: Document...
 */
export default class ClientProcess extends EventEmitter {
  // TODO: Move these into constructor
  // _base = 'ClientProcess';
  _pid = -1;
  _parentProcess = null;
  _parentPID = -1;
  _cmd = null;
  _startDate = null;
  _serviceURI = null;
  _isLaunched = false;
  _isExited = false;
  _threadType = THREAD_TYPE_SHARED;
  _title = null;

  stdin = null; // Pipe
  stdout = null; // Pipe
  stderr = null; // Pipe

  _setImmediateCallStack = [];
  _nextTickCallStack = [];

  _tickTimeout = null;

  constructor(parentProcess, cmd, options = {}) {
    super();

    // Increment up for the next process
    nextPID++;

    // Register process with processLinkedState
    processLinkedState.addProcess(this);

    if (parentProcess &&
      parentProcess.getIsExited()) {
      throw new Error('Cannot fork from an exited process');
    } else if (typeof parentProcess === 'undefined') {
      throw new Error('parentProcess must be set');
    } else if (parentProcess === false) {
      parentProcess = null;
    }

    this._parentProcess = parentProcess;
    if (this._parentProcess !== null) {
      this._parentPID = this._parentProcess.getPID();
    }
    this._isReady = false;
    this._cmd = cmd;
    this._pid = nextPID;
    this._startDate = new Date();
    this._options = options;

    if (typeof window !== 'undefined') {
      // TODO: Can a service worker use this, somehow?
      this._serviceURI = window.location.href;
    }

    // Provides stdin/stdout/stderr
    this._initDataPipes();

    // Run init in next tick
    this.setImmediate(async () => {  
      try {
        await this._init();
      } catch (exc) {
        throw exc;
      }
    });
  }

  /**
   * Initializes the process.
   * 
   * @return {Promise<void>} Promise resolves after process has fully launched.
   */
  async _init() {
    try {
      await new Promise((resolve, reject) => {
        try {
          this.setImmediate(async () => {
            try {
              // Automatically launch
              await this._launch();
                    
              // Set internal ready state
              this._isReady = true;

              // Tell listeners the process is ready
              this.emit(EVT_READY);

            } catch (exc) {
              throw exc;
            }
          });

          resolve();
        } catch (exc) {
          reject(exc);
        }
      });
    } catch (exc) {
      throw exc;
    }
  }

  getOptions() {
    return this._options;
  }

  /**
   * Determines whether the process is ready for consumption as a service.
   * 
   * @return {boolean}
   */
  getIsReady() {
    return this._isReady();
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

  _initDataPipes() {
    // TODO: Dynamically allocate
    this.stdin = new ClientProcessPipe(this, PIPE_NAME_STDIN); // TODO: Use contant for pipe name
    this.stdout = new ClientProcessPipe(this, PIPE_NAME_STDOUT); // TODO: Use contant for pipe name
    this.stderr = new ClientProcessPipe(this, PIPE_NAME_STDERR); // TODO: Use contant for pipe name
  }

  setTitle(title) {
    this.setImmediate(() => {
      this._title = title;
    });
  }

  getTitle() {
    return this._title;
  }

  /**
   * Retrieves the direct descendant processes forked from this current
   * process.
   * 
   * @return {ClientProcess[]}
   */
  getChildren() {
    const { processes } = processLinkedState.getState();
    const pid = this.getPID();

    const children = processes.filter((proc) => {
      const testParentPID = proc.getParentPID();

      return testParentPID === pid;
    });

    return children;
  }

  /**
   * Executes this._cmd.
   */
  async _launch() {
    if (this._isLaunched) {
      console.warn('Process has already launched');
      return;
    }

    console.debug(`Executing ${this.getClassName()}`, this);

    // Set monitoring flag states before execution so that they are available during execution
    this._isLaunched = true;

    try {
      if (typeof this._cmd !== 'function') {
        console.warn(
          `"cmd" is not a function, ignoring passed launch command.  If writing
          multithreaded code anything executed outside of "cmd" will be run on
          the main thread.`
        );
        return;
      }

      // Run cmd in this process scope
      await this._cmd(this);
    } catch (exc) {
      this.kill();
      throw exc;
    }
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
  setImmediate = async (callback/*, error*/) => {
    callback = makeCallback(this, callback);
    // error = makeCallback(this, error);

    this._setImmediateCallStack.push({
      callback,
      // error
    });

    this._tick();
  }

  /**
   * @see https://nodejs.org/de/docs/guides/event-loop-timers-and-nexttick/
   */
  nextTick = async (callback/*, error*/) => {
    callback = makeCallback(this, callback);
    // error = makeCallback(this, error);

    this._nextTickCallStack.push({
      callback,
      // error
    });

    this._tick();
  }

  /**
   * Non-standard process API method(?)
   */
  setTimeout() {
    console.debug('TODO: Implement proc.setTimeout()');
  }

  /**
   * Non-standard process API method(?)
   */
  clearTimeout() {
    console.debug('TODO: Implement proc.clearTimeout()');
  }

  /**
   * Non-standard process API method(?)
   */
  setInterval() {
    console.debug('TODO: Implement proc.setInterval()');
  }

  /**
   * Non-standard process API method(?)
   */
  clearInterval() {
    console.debug('TODO: Implement proc.clearInterval()');
  }

  _tick() {
    if (this._tickTimeout) {
      clearTimeout(this._tickTimeout);
    }

    this._tickTimeout = setTimeout(async () => {
      try {
        for (let i = 0; i < this._nextTickCallStack.length; i++) {
          const { callback /*, error*/ } = this._nextTickCallStack[i];

          try {
            await callback();
          } catch (exc) {
            // error(exc);
            throw(exc);
          }
        }

        this._nextTickCallStack = [];

        // Execute all setImmediate()
        for (let i = 0; i < this._setImmediateCallStack.length; i++) {
          const { callback /*, error*/ } = this._setImmediateCallStack[i];

          try {
            await callback();
          } catch (exc) {
            // error(exc);
            throw(exc);
          }
        }

        this._setImmediateCallStack = [];

        this.emit(EVT_TICK);
      } catch (exc) {
        throw exc;
      }
    }, 0);
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

  getClassName() {
    return this.constructor.name;
  }

  /**
   * TODO: Add optional signal
   */
  async kill(killSignal = 0) {
    console.debug(`Shutting down ${this.getClassName()}`, this);

    // Tell anyone that this operation is about to complete
    this.emit(EVT_BEFORE_EXIT);

    // Remove child processes
    const children = this.getChildren();
    for (let i = 0; i < children.length; i++) {
      try {
        const proc = children[i];

        await proc.kill();
      } catch (exc) {
        console.error(exc);
      }
    }

    // Clean up event handles
    this.removeAllListeners();

    // Unregister process with processLinkedState
    processLinkedState.removeProcess(this);

    // Set our exit flag
    this._isExited = true;

    // Let anyone know that this operation has completed
    this.emit(EVT_EXIT);

    console.debug(`Exited ${this.getClassName()} with signal: ${killSignal}`, this);
  }

  getIsExited() {
    return this._isExited;
  }
}