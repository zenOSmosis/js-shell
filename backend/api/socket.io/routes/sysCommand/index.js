const LinuxGPUChildProcess = require('../../../../utils/linux/LinuxGPUChildProcess');

const sysCommand = (commandData, ack) => {
  const {command, args, options = {}} = commandData;
  const {linuxGPUNumber = 0} = options;

  const child = new LinuxGPUChildProcess(linuxGPUNumber, command, args);

  child.on('spawn', () => {
    ack('Cool!  Spawned!');
  });

  /*
  const child = exec(command, (error, stdout, stderr) => {
    socket.emit('sys-command-update', {
      pid: child.pid,
      error,
      stdout,
      stderr
    });
  });

  child.on('close', (code, signal) => {
    socket.emit('sys-command-update', {
      pid: child.pid,
      code,
      signal
    });
  });

  ack({
    pid: child.pid
  });
  */
};

module.exports = sysCommand;