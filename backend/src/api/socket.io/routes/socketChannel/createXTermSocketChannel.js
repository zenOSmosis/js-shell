// @see https://gist.github.com/steinwaywhw/9920493

const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');
const { SocketChannel } = require('utils/socketAPI/SocketChannel');
const os = require('os');
const pty = require('node-pty');
// const terminal = require('term.js');
// const fs = require('fs');

/**
 * Creates a virtual socket channel on top of the existing Socket.io connection
 * for real-time, two-way communications between server and client processes.
 * 
 * @param {Object} options? 
 * @param {function} ack?
 */
const createXTermSocketChannel = async (options = {}, ack) => {
  return handleSocketAPIRoute(() => {
    const { socket } = options;

    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

    // Establish the virtual channel
    const socketChannel = new SocketChannel(socket);
    const socketChannelID = socketChannel.getChannelID();

    // Create shell process
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',

      handleFlowControl: true,

      // TODO: Set these dynamically
      cols: 80,
      rows: 30,

      cwd: process.env.HOME,
      env: process.env,

      // stdio: 'inherit',
      // detached: true,
      // customFds: [0, 1, 2]
    });

    // STDIN from socket
    socketChannel.on('data', (data) => {
      ptyProcess.write(socketChannel.ab2str(data));
    });

    // STDOUT from process
    ptyProcess.on('data', (data) => {
      socketChannel.write(socketChannel.str2ab(data));
    });

    ptyProcess.on('exit', () => {
      socketChannel.disconnect();
    });

    socketChannel.on('disconnect', () => {
      ptyProcess.exit(0);
    });

    // console.log('socketChannelID', socketChannelID);

    // ptyProcess.write('ls\r');
    // ptyProcess.resize(100, 40);
    // ptyProcess.write('ls\r');

    return {
      socketChannelID
    };

    // return new Date();
  }, ack);
};

module.exports = createXTermSocketChannel;