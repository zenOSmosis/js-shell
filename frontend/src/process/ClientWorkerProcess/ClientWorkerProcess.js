// TODO: Look into: https://github.com/mohayonao/inline-worker/

import ClientProcess, { THREAD_TYPE_DISTINCT } from '../ClientProcess';
import ClientWorkerDispatchPipe from './ClientWorkerDispatchPipe';
import createWebWorker from 'utils/createWebWorker';

// TODO: Rename to ClientWorkerHostProcess
export default class ClientWorkerProcess extends ClientProcess {
  _base = 'ClientWorkerProcess';
  _nativeWorker = null;

  constructor(parentProcess, cmd) {
    super(
      parentProcess,

      // Override initial parent process with an empty instruction
      // (cmd is serialized, then executed, further down)
      (proc) => {}
    );

    this._threadType = THREAD_TYPE_DISTINCT;

    // This code is evaluated inside of the native Worker
    // TODO: Build this unserialized, then dynamically serialize what needs to
    // run in the native Worker
    const code = `
      importScripts('https://cdnjs.cloudflare.com/ajax/libs/EventEmitter/5.2.6/EventEmitter.js');
      
      if (typeof EventEmitter === 'undefined') {
        throw new Error('Could not obtain EventEmitter');
      }

      class WorkerPipe extends EventEmitter {
        write(data) {
          console.debug('writing', data);

          // return this.emit('data', data);
          self.postMessage(data);
        }
      }

      class ClientWorkerRemoteProcess extends EventEmitter {
        constructor() {
          super();

          this._inboundMessagePipeName = null;

          // Obtained from outer process serializer
          this._pid = ${this.getPID()};

          this._initDataPipes();

          // Intentional non-usage of arrow function to target older browsers
          const worker = this;
          self.addEventListener('message', function messageListener (msg) {
            let isControlMsg = false;
        
            const { data } = msg;

            console.log('received message data', data);
        
            // TODO: Obtain from constants
            const routedPipeNames = [
              'stdin',
              'stdout',
              'stderr',
              'stdctrlin',
              'stdctrlout'
            ];
        
            for (let i = 0; i < routedPipeNames.length; i++) {
              const testName = routedPipeNames[i];
              const testIdx = data.indexOf('use-pipe:' + testName);
        
              /*
              console.log({
                testName,
                testIdx,
                data
              });
              */
        
              if (testIdx === 0) {
                isControlMsg = true;
                console.debug('Changing inbound message pipe name to:', testName);
                worker._inboundMessagePipeName = testName;
              }
            }
        
            if (!isControlMsg &&
                worker._inboundMessagePipeName &&
                worker._inboundMessagePipeName.length) {
              // console.debug('TODO: Pass to pipe', worker._inboundMessagePipeName, data);
        
              const writePipe = worker[worker._inboundMessagePipeName];
        
              console.debug({ writePipe, class: worker, pipeName: worker._inboundMessagePipeName });
        
              worker[worker._inboundMessagePipeName].emit('data', data);
            }
          });
        }
        
        _initDataPipes() {
          this.stdin = new WorkerPipe(this);
          this.stdout = new WorkerPipe(this);
          this.stderr = new WorkerPipe(this);

          this.stdctrlin = new WorkerPipe(this);
          this.stdctrlout = new WorkerPipe(this);
        }

        postMessage(message) {
          nativeWorker.postMessage(message);
        }
        
        getPID() {
          return  this._pid;
        }

        getClassName() {
          // TODO: Fix constructor name render
          return '${`${this.getClassName()} => $/{this.constructor.name/}`}';
        }

        kill() {
          console.warn('TODO: Kill in parent process');
        }
      }

      const remoteProcess = new ClientWorkerRemoteProcess();
  
      console.debug('Initialized ClientWorkerRemoteProcess', {
        remoteProcess,
        className: remoteProcess.getClassName()
      });

      const exec = ${cmd.toString()};

      // Execute w/ remoteProcess
      exec(remoteProcess);
    `;

    /*
    const blob = new Blob([code], {
      type: 'text/javascript'
    });
    const blobURL = URL.createObjectURL(blob);

    this._serviceURI = blobURL;

    this._nativeWorker = new window.Worker(blobURL);

    this._nativeWorker.addEventListener('message', (data) => {
      console.debug('Received message from worker', data);

      console.debug('Sending message to worker')
      this._nativeWorker.postMessage('PONG');
    });*/

    this._nativeWorker = createWebWorker(code);

    this._serviceURI = this._nativeWorker.getServiceURI();
  }

  _initDataPipes() {
    // TODO: Use constants for pipe names
    this.stdin = new ClientWorkerDispatchPipe(this, 'stdin');
    this.stdout = new ClientWorkerDispatchPipe(this, 'stdout');
    this.stderr = new ClientWorkerDispatchPipe(this, 'stderr');

    this.stdctrlin = new ClientWorkerDispatchPipe(this, 'stdctrlin');
    this.stdctrlout = new ClientWorkerDispatchPipe(this, 'stdctrlout');
  }

  /**
   * Executes postMessage() on the native Worker.
   * 
   * @param {string | object | any} message 
   */
  postMessage(message) {
    if (!this._nativeWorker) {
      console.warn('Native Worker does not exist. Ignoring postMessage call.');
      return;
    }
    this._nativeWorker.postMessage(message);
  }

  async kill(killSignal = 0) {
    if (this._nativeWorker) {
      this._nativeWorker.terminate();
    }

    await super.kill(killSignal);
  }
}