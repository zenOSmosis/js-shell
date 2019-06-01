import EventEmitter from 'events';
import ClientProcess from '../ClientProcess';
import ClientWorkerDispatchPipe from './ClientWorkerDispatchPipe';
import createWebWorker from 'utils/createWebWorker';
import workerBootstrapperTxt from './remote/ClientWorker_WorkerBootstrapper.js.txt';

/**
 * Spins up the native Worker, and allows it to be controlled.
 * 
 * TODO: Finish building out
 */
class NativeWorkerController extends EventEmitter {
  constructor(hostPID, cmd) {
    super();

    this._hostPID = hostPID;
    this._cmd = cmd;

    (async () => {
      try {
        const code = await this._read();
      } catch (exc) {
        throw exc;
      }
    })();
  }

  _read = async () => {
    try {
      const res = await fetch(workerBootstrapperTxt);
      let text = await res.text();

      text = text.split('%CONTROLLER_PID%').join(this._hostPID);
      text = text.split('%CMD%').join(this._cmd);

      // console.debug(text);

    } catch (exc) {
      throw exc;
    }
  };

  /*
  _launch() {
    // TODO: Use createWebWorker()

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
    });
  }
  */

  kill() {
    this.removeAllListeners();
  }
}

new NativeWorkerController('FAKE-CONTROLLER-ID', 'doReallyGreatThings()');

// TODO: Rename to ClientWorkerHostProcess
export default class ClientWorkerProcess extends ClientProcess {
  _nativeWorker = null;

  constructor(cmd, parentProcess = null) {
    super(
      // Override initial parent process with an empty instruction
      (proc) => { },

      parentProcess
    );

    // This code is evaluated inside of the native Worker
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
      
            console.log('received message', msg);
        
            const { data } = msg;
        
            const routedPipeNames = [
              'stdin',
              'stdout',
              'stderr'
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
        }

        postMessage(message) {
          nativeWorker.postMessage(message);
        }
        
        getPID() {
          return  this._pid;
        }

        getClassName() {
          return '${`${this.getClassName()} => $/{this.constructor.name/}`}';
        }

        setName(name) {
          console.warn('TODO: Set name in parent process', name);
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
  }

  _initDataPipes() {
    this.stdin = new ClientWorkerDispatchPipe(this, 'stdin');
    this.stdout = new ClientWorkerDispatchPipe(this, 'stdout');
    this.stderr = new ClientWorkerDispatchPipe(this, 'stderr');
  }

  postMessage(message) {
    this._nativeWorker.postMessage(message);
  }

  kill() {
    this._nativeWorker.terminate();

    super.kill();
  }
}