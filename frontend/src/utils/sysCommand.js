import socket from './socket.io';

const sysCommand = (command, args = [], options = {}) => {
  socket.emit('sys-command', {
    command,
    args,
    options
  }, (ack) => {
    console.debug(ack);
  });
};

socket.on('sys-command-update', (data) => {
  console.debug('sys-command-update', data);
});

export default sysCommand;