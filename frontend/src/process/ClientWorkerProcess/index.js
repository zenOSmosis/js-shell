import ClientProcess from '../ClientProcess';

export default class ClientWorkerProcess extends ClientProcess {
  _nativeWorker = null;

  constructor(cmd, parentProcess = null) {
    super(
      (proc) => {},
      parentProcess
    );

    const code = `
      const proc = {
        postMessage: (message) => {
          self.postMessage(message);
        },
        
        on: (...args) => {
          return self.addEventListener(...args);
        },

        off: (...args) => {
          return self.removeEventListener(...args);
        },

        getPID: () => {
          return ${this.getPID()}
        },

        getClassName: () => {
          console.warn('TODO: Retrieve from parent process');
        },

        setName: (name) => {
          console.warn('TODO: Set name in parent process', name);
        },

        kill: () => {
          console.warn('TODO: Kill in parent process');
        }
      };

      const exec = ${cmd.toString()};

      exec(proc);
    `;

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

  postMessage(message) {
    this._nativeWorker.postMessage(message);
  }

  kill() {
    this._nativeWorker.terminate();

    super.kill();
  }
}