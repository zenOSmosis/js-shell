import socket from './socket.io';

const systemCommand = (command, args = [], options = {}) => {
  socket.emit('system-command', {
    command,
    args,
    options
  }, (ack) => {
    console.debug(ack);
  });
};

socket.on('system-command-update', (data) => {
  console.debug('system-command-update', data);
});

export default systemCommand;