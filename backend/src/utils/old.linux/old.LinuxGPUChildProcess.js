const ChildProcess = require('../old.ChildProcess');

class LinuxGPUChildProcess extends ChildProcess {
  constructor(gpuNumber = 0, command, args=[]) {
    const passedArgs = [`DRI_PRIME=${gpuNumber}`, command];
    args.forEach((arg) => {
      passedArgs.push(arg);
    });

    super('env', passedArgs);
  }
}

module.exports = LinuxGPUChildProcess;
