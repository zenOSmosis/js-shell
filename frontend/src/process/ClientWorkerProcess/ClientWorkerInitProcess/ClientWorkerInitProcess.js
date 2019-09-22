import ClientProcess, { EVT_PIPE_DATA } from 'process/ClientProcess';

const STAGE_0_WORKER_HELLO = '[HELLO FROM NATIVE WORKER]';
const STAGE_1_CTRL_COMMAND = '[INIT COMMAND FROM WORKER HOST CONTROLLER]';
const STAGE_2_WORKER_READY = '[WORKER PROCESS READY]';

/**
 * @extends ClientProcess
 * 
 * Provides initial sync of Web Worker and controller.
 * 
 * Note: This runs in both the Web Worker and the controller process.
 */
class ClientWorkerInitProcess extends ClientProcess {
  /**
   * @param {ClientWorkerProcessController | ClientWorkerProcess} clientWorkerHostOrNativeProcess 
   */
  constructor(clientWorkerHostOrNativeProcess) {
    super(clientWorkerHostOrNativeProcess);

    this._clientWorker = clientWorkerHostOrNativeProcess;
  }

  async _init() {
    try {
      let initStages = [];

      // "Hello" prototype stage
      /*
      initStages.push(
        async () => {
          try {
            await this._clientWorker.setDualCommand({
              controllerCommand: async () => {
                try {
                  console.warn('HELLO FROM THE CONTROLLER (MAIN-THREAD)');
                } catch (exc) {
                  throw exc;
                }
              },

              workerCommand: async () => {
                try {
                  console.warn('HELLO FROM THE WEB WORKER');
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
      */

      // Handle initial "Hello" from Web Worker
      initStages.push(
        async () => {
          try {
            await this._clientWorker.setDualCommand({
              controllerCommand: async () => {
                try {
                  return await new Promise((resolve, reject) => {
                    try {
                      let ctrlHandler = null;

                      this._clientWorker.stdctrl.on(EVT_PIPE_DATA, ctrlHandler = (data) => {
                        const { ctrlName, ctrlData } = data;
    
                        if (ctrlName === STAGE_0_WORKER_HELLO) {
                          const { serviceURL } = ctrlData;
    
                          // TODO: Don't write directly to (semi)private variables
                          this._clientWorker.setImmediate(() => {
                            this._clientWorker._serviceURL = serviceURL;
  
                            resolve();
                          });

                          // Unregister ctrlHandler
                          this._clientWorker.stdctrl.off(EVT_PIPE_DATA, ctrlHandler);
                        }
                      });
                    } catch (exc) {
                      reject(exc);
                    }
                  });
                } catch (exc) {
                  throw exc;
                }
              },
              
              workerCommand: async () => {
                try {
                  const serviceURL = this._clientWorker.getServiceURL();

                  this._clientWorker.stdctrl.write({
                    ctrlName: STAGE_0_WORKER_HELLO,
                    ctrlData: {
                      serviceURL
                    }
                  });
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

      // Send original sync data from controller
      initStages.push(
        async () => {
          try {
            await this._clientWorker.setDualCommand({
              controllerCommand: async () => {
                try {
                  this._clientWorker.setImmediate(() => {  
                    const pid = this._clientWorker.getPid();
                    let workerCmd = this._clientWorker.getWorkerCmd();
                    if (workerCmd) {
                      // Serialize workerCmd, so we can pass it 
                      workerCmd = workerCmd.toString();
                    }
                    
                    // Pass options from controller to Worker.
                    // We fetch the options from the controller here, and then
                    // call the extended setOptions() method, which passes the
                    // options to the Web Worker over stdctrl.
                    this._clientWorker.setOptions(this._clientWorker.getOptions());

                    this._clientWorker.stdctrl.write({
                      ctrlName: STAGE_1_CTRL_COMMAND,
                      ctrlData: {
                        pid,
                        workerCmd
                      }
                    });
                  });
                } catch (exc) {
                  throw exc;
                }
              },

              workerCommand: async () => {
                try {
                  return await new Promise((resolve, reject) => {
                    try {
                      let ctrlHandler = null;

                      this._clientWorker.stdctrl.on(EVT_PIPE_DATA, ctrlHandler = (data) => {
                        const { ctrlName, ctrlData } = data;
        
                        if (ctrlName === STAGE_1_CTRL_COMMAND) {
                          const { workerCmd, pid } = ctrlData;
    
                          this._clientWorker.setImmediate(() => {
                            try {
                              this._clientWorker._pid = pid;
      
                              // Execute the worker command
                              // Important!  Do not use the proc._launch method here!
                              this._clientWorker.evalInProcessContext(workerCmd);
          
                              this._clientWorker.stdctrl.write({
                                ctrlName: STAGE_2_WORKER_READY
                              });
        
                              resolve();
                            } catch (exc) {
                              reject(exc);
                            }
                          });

                          // Unregister ctrlHandler
                          this._clientWorker.stdctrl.off(EVT_PIPE_DATA, ctrlHandler);
                        }
                      });
                    } catch (exc) {
                      reject(exc);
                    }
                  });
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

      // Handle online notification from Web Worker
      initStages.push(
        async () => {
          try {
            await this._clientWorker.setDualCommand({
              controllerCommand: async () => {
                try {
                  return await new Promise((resolve, reject) => {
                    try {
                      let ctrlHandler = null;
                      
                      this._clientWorker.stdctrl.on(EVT_PIPE_DATA, ctrlHandler = (data) => {
                        const { ctrlName } = data;
    
                        if (ctrlName === STAGE_2_WORKER_READY) {
                          resolve();

                          // Unregister ctrlHandler
                          this._clientWorker.stdctrl.off(EVT_PIPE_DATA, ctrlHandler);
                        }
                      });
                    } catch (exc) {
                      reject(exc);
                    }
                  });
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

      const lenStages = initStages.length;
      for (let i = 0; i < lenStages; i++) {
        // console.debug(`starting stage ${i}`);
        await initStages[i]();
        //console.debug(`completed stage ${i}`)
      }

      // Initialize the super
      await super._init();

      // KILL THIS AUTHENTICATOR PROCESS AFTER INIT
      this.exit();
    } catch (exc) {
      throw exc;
    }
  }
}

export default ClientWorkerInitProcess;