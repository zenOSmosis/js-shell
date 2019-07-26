// TODO: Consider re-implementing either here, or in a separate Docker container

// const LinuxGPUChildProcess = require('../../../../utils/linux/LinuxGPUChildProcess');

const systemCommand = (commandData, ack) => {
  console.error('Ignoring system command', commandData);

  ack({
    error: 'Ignored'
  });

  /*
  const {command, args, options = {}} = commandData;
  const {linuxGPUNumber = 0} = options;

  const child = new LinuxGPUChildProcess(linuxGPUNumber, command, args);

  // TODO: Revamp this
  child.on('spawn', () => {
    ack('Cool!  Spawned!');
  });
  */

  /*
  const child = exec(command, (error, stdout, stderr) => {
    socket.emit('system-command-update', {
      pid: child.pid,
      error,
      stdout,
      stderr
    });
  });

  child.on('close', (code, signal) => {
    socket.emit('system-command-update', {
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

module.exports = systemCommand;