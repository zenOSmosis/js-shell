// TODO: Get ideas from https://github.com/defunctzombie/node-process/blob/master/browser.js

import EventEmitter from 'events';
import ProcessLinkedState from 'state/ProcessLinkedState';
import CPUTimeLinkedState from 'state/CPUTimeLinkedState';
import ClientProcessPipe from './ClientProcessPipe';
import CPUThreadTimer, { EVT_CYCLE as CPU_THREAD_CLOCK_CYCLE } from './CPUThreadTimer';
import makeCallback from './makeCallback';
import evalInContext from 'utils/evalInContext';
import getNow from 'utils/time/getNow';

import {
  EVT_READY,
  EVT_TICK,

  EVT_STATE_UPDATE,

  EVT_BEFORE_EXIT,
  EVT_EXIT,

  THREAD_TYPE_MAIN,

  PIPE_NAMES
} from './constants';

// Keeps track of running processes
const processLinkedState = new ProcessLinkedState();

const cpuTimeLinkedState = new CPUTimeLinkedState();

// The process id of the next process (auto-incremented in the ClientProcess
// constructor)
let nextPID = 1;

// The first process in the thread
let rootProcess = null;

/**
 * An object-oriented way of managing client-side processes, somewhat
 * resembling a simplified version of Node.js processes.
 * 
 * Multiple, green-threaded, ClientProcess instances can be run on the main
 * thread, and ClientProcess extensions such as ClientWorkerProcess act
 * a server-client model when running Web Workers, where the controller runs
 * on the main thread, which controls the relevant Worker thread.
 */
export default class ClientProcess extends EventEmitter {
  /**
   * 
   * @param {ClientProcess | boolean} parentProcess If false is passed and
   * there is already a root process, the root process will be utilized as
   * the parent. 
   * @param {Function} cmd 
   * @param {object} options 
   */
  constructor(parentProcess, cmd, options = {}) {
    super();

    if (!rootProcess) {
      rootProcess = this;
    }

    this._isRootProcess = (Object.is(this, rootProcess));
    this._rootThreadTimer = null;
    this._handleCPUThreadCycle = this._handleCPUThreadCycle.bind(this);

    this._pid = nextPID;

    // Increment nextPID for the next process
    ++nextPID;

    if (parentProcess &&
      parentProcess.getIsExited()) {
      throw new Error('Cannot fork from an exited process');
    } else if (typeof parentProcess === 'undefined') {
      throw new Error('parentProcess must be set');
    } else if (!rootProcess) {
      throw new Error('rootProcess not internally set!');
    } else if (parentProcess === false) {
      parentProcess = rootProcess;
    }

    this._parentProcess = parentProcess;
    if (this._parentProcess !== null) {
      this._parentPID = this._parentProcess.getPID();
    }

    // Set to true after process has initialized
    this._isReady = false;

    this._isShuttingDown = false;

    // Set to true after process has exited
    // Note, the process should no longer be interacted w/ and all references
    // should be discarded before, or at once, this value sets
    this._isExited = false;

    // Set to true after _launch() has been called, before command has executed
    this._isLaunchStarted = false;

    this._threadType = THREAD_TYPE_MAIN;
    this._title = null;

    this._isGUIProcess = false;
    this._cmd = cmd;
    this._startTime = getNow();
    this._options = options;
    this._serviceURI = null;

    // STDIO pipes
    this.stdin = null; // Pipe
    this.stdout = null; // Pipe
    this.stderr = null; // Pipe

    // Tick callstacks
    this._setImmediateCallStack = [];
    this._nextTickCallStack = [];

    this._tickTimeout = null;

    this._state = {};

    if (typeof window !== 'undefined') {
      // TODO: Can a service worker use this, somehow?
      this._serviceURI = window.location.href;
    }

    // Provides stdin/stdout/stderr
    this._initDataPipes();

    // Run init in next tick
    this.setImmediate(async () => {
      try {
        if (!this._isExited) {
          // Register process with processLinkedState
          // Important, processLinkedState must be set in setImmediate or it won't
          // accurately reflect process extensions until the next tick.
          // Without using setImmediate, GUI components, etc. won't render until the
          // next tick.
          processLinkedState.addProcess(this);
        }

        await this._init();
      } catch (exc) {
        throw exc;
      }
    });
  }

  /**
   * Initializes the process.
   * 
   * Important! Process extensions which require their own _init routines
   * should initialize their own _init routines before calling super._init().
   * 
   * @return {Promise<void>} Promise resolves after process has fully launched.
   */
  async _init() {
    try {
      return await new Promise(async (resolve, reject) => {
        try {
          if (this._isRootProcess) {
            await this._initRootProcess();
          }

          // Automatically launch
          await this._launch();

          // Set internal ready state
          this._isReady = true;

          // Tell listeners the process is ready
          this.emit(EVT_READY);

          resolve();
        } catch (exc) {
          reject(exc);
        }
      });
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Initializes the first process in a thread.  Called internally by
   * this._init() if first process.
   */
  async _initRootProcess() {
    try {
      if (!this._isRootProcess) {
        throw new Error('_initRootProcess called on non-root process');
      }

      // Init root thread timer
      (() => {
        this._rootThreadTimer = new CPUThreadTimer();

        this._rootThreadTimer.on(CPU_THREAD_CLOCK_CYCLE, this._handleCPUThreadCycle);

        this._initCPUThreadRootProcess();
  
        // Automatically stop the timer when exiting the process
        this.on(EVT_BEFORE_EXIT, () => {
          this._rootThreadTimer.stop();
  
          this._rootThreadTimer = null;
        });
      })();

      // Main thread handling
      /*
      if (this._threadType === THREAD_TYPE_MAIN) {
        this.on(EVT_BEFORE_EXIT, () => {
           // Automatically reload window, if DOM & closing root process
          window.location.reload();
        });
      }
      */
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Important!  This should only be called from the first process, and any
   * Worker controller processes.
   */
  _initCPUThreadRootProcess() {
    cpuTimeLinkedState.addThreadRootProcess(this);

    this.on(EVT_BEFORE_EXIT, () => {
      cpuTimeLinkedState.removeThreadRootProcess(this);
    });
  }

  /**
   * Internally called in the root process, as well as Web Worker controllers,
   * in order to pass CPU usage for relevant threads to LinkedState.
   * 
   * Important!  This should only be called from the first process, and any
   * Worker controller processes.
   * 
   * @param {Number} cpuThreadUsagePercent 
   */
  _handleCPUThreadCycle(cpuThreadUsagePercent) {
    // TODO: Build out
    /*console.debug({
      root: this,
      cpuThreadUsagePercent
    });
    */
    cpuTimeLinkedState.setCPUThreadUsagePercent(this, cpuThreadUsagePercent);
  }

  /**
   * Init default stdio data pipes.
   */
  _initDataPipes() {
    PIPE_NAMES.forEach(pipeName => {
      this[pipeName] = new ClientProcessPipe(this, pipeName);
    });
  }

  setState(nextState, onSet = null) {
    if (this._isShuttingDown || this._isExited) {
      console.error('Ignoring state set on shut down process.  This could indicate a memory leak somewhere in the application.');
      return;
    }

    const prevState = this._state;
    const mergedState = {...prevState, ...nextState};
    this._state = mergedState;

    if (typeof onSet === 'function') {
      onSet();
    }

    // Emit with updated state
    this.emit(EVT_STATE_UPDATE, nextState);
  }

  getState() {
    return this._state;
  }

  /**
 * Determines whether the process is ready for consumption as a service.
 * 
 * @return {boolean}
 */
  getIsReady() {
    return this._isReady;
  }

  /**
   * Resolves once the process is ready.
   * 
   * @return {Promise<void>}
   */
  onceReady() {
    return new Promise((resolve, reject) => {
      try {
        if (this.getIsReady()) {
          // Resolve immediately
          return resolve();
        } else {
          // Await ready
          this.once(EVT_READY, () => {
            return resolve();
          });
        }
      } catch (exc) {
        reject(exc);
      }
    });
  }

  getIsRootProcess() {
    return this._isRootProcess;
  }

  /**
   * Evaluates the given command in the process' context.
   * 
   * @param {Function | String} cmd 
   * @return {Promise<void>} Resolves after cmd stack frames have processed.
   */
  async evalInProcessContext(cmd) {
    try {
      if (typeof cmd === 'function') {
        const exec = () => {
          cmd(this);
        };

        await exec.call(cmd);
      } else if (typeof cmd === 'string') {
        // throw new Error('String processing in process context is not currently available');

        cmd = cmd.toString();

        evalInContext(`
          const ___serializedCmd___ = ${cmd};
    
          // Patches Babel's _this binding to represent this process' scope
          const _this = this;
          
          // Re-route setImmediate calls to this process
          const setImmediate = this.setImmediate;
    
          // Evaluate serialized command in ClientProcess instance
          // context, as well as passing "this" as the parameter
          await ___serializedCmd___.call(this, this);
        `, this);
      } else {
        console.warn('Unhandled cmd type:', (typeof cmd));
      }
    } catch (exc) {
      // TODO: Determine if uncaughtException or unhandledRejection & emit
      // corresponding process event with the error
      // TODO: Don't rethrow
      throw exc;
    }
  }

  /**
   * Sets process options, merging new options into existing.
   * 
   * @param {object} options 
   */
  setOptions(options = {}) {
    // Set options on current tick
    this._options = Object.assign({}, this._options, options);

    // Advance to next tick, for any EVT_TICK listeners
    this._tick();
  }

  /**
   * Retrieves current process options.
   * 
   * @return {object}
   */
  getOptions() {
    return this._options;
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

  setTitle(title) {
    // Set title on current tick
    this._title = title;

    // Advance to next tick, for any EVT_TICK listeners
    this._tick();
  }

  getTitle() {
    return this._title || this.getClassName();
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
   * Retrieves whether the process is a GUI process, with internal React bindings, etc.
   * 
   * Note, GUI processes are only available on the main thread.
   * 
   * @return {boolean}
   */
  getIsGUIProcess() {
    return this._isGUIProcess;
  }

  /**
   * Executes this._cmd.
   */
  async _launch() {
    try {
      // Prevent possiblity of double-launch
      if (this._isLaunchStarted) {
        // console.warn('Process has already launched');
        return;
      } else {
        this._isLaunchStarted = true;
      }

      // console.debug(`Executing ${this.getClassName()}`, this);

      if (typeof this._cmd !== 'function') {
        console.warn(
          `"cmd" is not a function, ignoring passed launch command.  If writing
          multithreaded code anything executed outside of "cmd" will be run on
          the main thread.`
        );
        return;
      }

      // Run cmd in this process scope
      await this.evalInProcessContext(this._cmd);

    } catch (exc) {
      // Automatically kill if crashed
      // TODO: Use killSignal constant for error
      this.kill(1);

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
  setImmediate = (callback = null/*, error = null*/) => {
    callback = makeCallback(this, callback);
    // error = makeCallback(this, error);

    // Usage of setImmediate during process init cycle causes weird issues
    // related to calling nested setImmediate calls multiple times.  This
    // indicates a potential bug in the setImmediate handling.
    // TODO: Refactor this portion of code.
    if (!this._isReady) {
      // Skip setImmediateCallStack addition, and run a new timeout
      setTimeout(callback, 0);

      // Proceed to next tick, w/o new stack frames added
      this._tick();

      // Ensure we stop here
      return;
    }

    this._setImmediateCallStack.push({
      callback,
      // error
    });

    this._tick();
  }

  /**
   * @see https://nodejs.org/de/docs/guides/event-loop-timers-and-nexttick/
   */
  nextTick = (callback = null/*, error = null*/) => {
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
    // TODO: CHECK IF PROCESS IS RUNNING BEFORE CONTINUING

    throw new Error('TODO: Implement proc.setTimeout()');
  }

  /**
   * Non-standard process API method(?)
   */
  clearTimeout() {
    throw new Error('TODO: Implement proc.clearTimeout()');
  }

  /**
   * Non-standard process API method(?)
   */
  setInterval() {
    // TODO: CHECK IF PROCESS IS RUNNING BEFORE CONTINUING

    throw new Error('TODO: Implement proc.setInterval()');
  }

  /**
   * Non-standard process API method(?)
   */
  clearInterval() {
    throw new Error('TODO: Implement proc.clearInterval()');
  }

  _tick() {
    // Prevent tick if process is exited
    if (this._isShuttingDown || this._isExited) {
      console.warn('Process is exiting, or has exited. Ignoring tick() call.', this);
      return;
    }

    clearTimeout(this._tickTimeout);

    // Runs after all existing stack frames complete
    // setTimeout with 0 timeout value emulates tick functionality as
    // it won't start until the current stack frames have run
    this._tickTimeout = setTimeout(async () => {
      try {
        // Prevent tick if process is stopped
        if (this._isShuttingDown || this._isExited) {
          return;
        }

        // Create a local copy of the call stacks
        const nextTickCallStack = this._nextTickCallStack;
        const lenNextTickCallStack = nextTickCallStack.length;

        const setImmediateCallStack = this._setImmediateCallStack;
        const lenSetImmediateCallStack = setImmediateCallStack.length;

        // Clear class property call stacks
        this._clearCallStacks();

        // Execute all nextTick()
        for (let i = 0; i < lenNextTickCallStack; i++) {
          const { callback /*, error*/ } = nextTickCallStack[i];

          await callback();
        }

        // Execute all setImmediate()
        for (let i = 0; i < lenSetImmediateCallStack; i++) {
          const { callback /*, error*/ } = setImmediateCallStack[i];

          await callback();
        }

        // Tell listeners a tick has been performed
        // TODO: This may be emitted in the wrong place in the code.  If this is moved,
        // add another event in its place and reassociate any existing listeners to the
        // new event name.
        this.emit(EVT_TICK);
      } catch (exc) {
        throw exc;
      }
    }, 0);
  }

  /**
   * Removes all stack frames from the nextTick and setImmediate call stacks
   */
  _clearCallStacks() {
    this._nextTickCallStack = [];
    this._setImmediateCallStack = [];
  }

  getThreadType() {
    return this._threadType;
  }

  getServiceURI() {
    return this._serviceURI;
  }

  getStartTime() {
    return this._startTime;
  }

  getUptime() {
    const now = getNow();

    return now - this._startTime;
  }

  /*
  getUptime() {
  }
  */

  getClassName() {
    const { name: className } = this.constructor;

    return className;
  }

  async close() {
    try {
      // TODO: Handle any checks to determine if process can be safely closed
      // this.emit(EVT_CLOSE_REQUEST);

      /**
       * A Promise is awaited for here to help ensure the proper value of this._shouldImmediatelyClose 
       * @return {Promise<boolean>} Whether the process should close
       */
       const shouldClose = await new Promise((resolve) => {  
        console.warn('TODO: Implement shouldClose functionality');
        return resolve(true);
        // return resolve(this._shouldImmediatelyClose);
      });
      
      if (shouldClose) {
        return await this.kill();
      }
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * TODO: Handle optional signal
   */
  async kill(killSignal = 0) {
    // Prevent trying to kill an already exited process
    if (this._isShuttingDown || this._isExited) {
      console.warn('Process already exited, or is shutting down');
      return;
    }

    // Tell anyone that this operation is about to complete
    this.emit(EVT_BEFORE_EXIT);

    this._isShuttingDown = true;

    this._clearCallStacks();

    // console.debug(`Shutting down ${this.getClassName()}`, this);

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

    // Unregister process with processLinkedState
    processLinkedState.removeProcess(this);

    // Set our exit flag
    this._isExited = true;

    // Let anyone know that this operation has completed
    this.emit(EVT_EXIT);

    // Clean up event handles
    // Important! This must be called after all other event emits have been
    // called
    this.removeAllListeners();

    // console.debug(`Exited ${this.getClassName()} with signal: ${killSignal}`, this);
  }

  /**
   * Retrieves whether if the process is exited.
   * 
   * @return {boolean}
   */
  getIsExited() {
    return this._isExited;
  }
}