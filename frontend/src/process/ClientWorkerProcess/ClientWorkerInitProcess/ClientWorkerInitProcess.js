import ClientProcess from 'process/ClientProcess';

// Sent from native Web Worker to main thread when it's initially launched, but not
// necessarily ready to be used
export const NATIVE_WORKER_ONLINE_MESSAGE = '[HELLO FROM NATIVE WORKER]';

export const HOST_CONTROLLER_CTRL_MESSAGE_INIT_CMD = '[INIT COMMAND FROM WORKER HOST CONTROLLER]';

export const WORKER_PROCESS_ONLINE_MESSAGE = '[NATIVE WORKER ONLINE]';

/**
 * Provides initial sync of Web Worker and controller.
 */
export default class ClientWorkerAuthInitProcess extends ClientProcess {
  /**
   * 
   * @param {ClientWorkerProcessController | ClientWorkerProcess} clientWorkerHostOrNativeProcess 
   */
  constructor(clientWorkerHostOrNativeProcess) {
    super(clientWorkerHostOrNativeProcess);

    this._clientWorker = clientWorkerHostOrNativeProcess;
  }

  async _init() {
    try {
      let stages = [];

      // "Hello" prototype stage 
      stages.push(
        async () => {
          try {
            await this._clientWorker.setDualCommand({
              workerCommand: async () => {
                try {
                  console.warn('HELLO FROM THE WEB WORKER');
                } catch (exc) {
                  throw exc;
                }
              },
              
              controllerCommand: async () => {
                try {
                  console.warn('HELLO FROM THE CONTROLLER (MAIN-THREAD)');
                } catch (exc) {
                  throw exc;
                }
              }
            });
          } catch (exc) {
            throw exc;
          }
        }
      );

      stages.push(
        async () => {
          try {
            await this._clientWorker.setDualCommand({
              workerCommand: async () => {
                try {
                  this._clientWorker.postMessage('Hello from Worker!');
                } catch (exc) {
                  throw exc;
                }
              },
              
              controllerCommand: async () => {
                try {
                  this._clientWorker.postMessage('Hello from controller!');
                } catch (exc) {
                  throw exc;
                }
              }
            });
          } catch (exc) {
            throw exc;
          }
        }
      );

      const lenStages = stages.length;
      for (let i = 0; i < lenStages; i++) {
        console.debug(`stage ${i}`);
        await stages[i]();
      }

      // Initialize the super
      await super._init();

      // KILL THIS AUTHENTICATOR PROCESS AFTER INIT
      this.kill();
    } catch (exc) {
      throw exc;
    }
  }
}