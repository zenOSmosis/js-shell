import ClientJITRuntime from 'process/ClientJITRuntime';

export const RUN_TARGET_MAIN = 'Main Thread';
export const RUN_TARGET_WORKER = 'Worker Thread';
export const RUN_TARGETS = [
  RUN_TARGET_MAIN,
  RUN_TARGET_WORKER
];

const exec = async (appRuntime, runTarget, sourceCode) => {
  try {
    const jitRuntime = new ClientJITRuntime(appRuntime);

    switch (runTarget) {
      case RUN_TARGET_MAIN:
        jitRuntime.exec(sourceCode);
        break;
  
      case RUN_TARGET_WORKER:
        const cmd = `
          const { ClientWorkerProcess } = this;
  
          new ClientWorkerProcess(process, (process) => {
            ${sourceCode}
          });
        `;
  
        jitRuntime.exec(cmd);
        break;
  
      default:
        jitRuntime.exit();
  
        throw new Error(`Invalid run target: ${runTarget}`);
    }
  } catch (exc) {
    throw exc;
  }
};

export default exec;