// @see https://gist.github.com/steinwaywhw/9920493

import handleSocketAPIRoute from 'utils/socketAPI/handleSocketAPIRoute';
import {
  SocketChannel,
  EVT_DATA as EVT_SOCKET_CHANNEL_DATA,
  EVT_BEFORE_DISCONNECT as EVT_SOCKET_CHANNEL_BEFORE_DISCONNECT
} from 'utils/socketAPI/SocketChannel';
import os from 'os';
const pty = require('node-pty');

/**
 * Creates a virtual socket channel on top of the existing Socket.io connection
 * for real-time, two-way communications between server and client processes.
 * 
 * @param {Object} options? 
 * @param {function} ack?
 */
const createXTermSocketChannel = async (options = {}, ack) => {
  return await handleSocketAPIRoute(() => {
    const { socket } = options;

    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

    // Establish the virtual channel
    const socketChannel = new SocketChannel(socket);
    const socketChannelID = socketChannel.getChannelID();

    // Create shell process
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',

      // TODO: Set these dynamically
      cols: 80,
      rows: 30,

      cwd: process.env.HOME,
      env: process.env,
    });

    // STDIN from socket
    socketChannel.on(EVT_SOCKET_CHANNEL_DATA, (data) => {
      ptyProcess.write(socketChannel.ab2str(data));
    });

    // STDOUT from process
    ptyProcess.on('data', (data) => {
      socketChannel.write(socketChannel.str2ab(data));
    });

    ptyProcess.on('exit', () => {
      socketChannel.disconnect();
    });

    socketChannel.on(EVT_SOCKET_CHANNEL_BEFORE_DISCONNECT, () => {
      // TODO: Is there not a way to directly exit the ptyProcess?
      const { _pid: ptyProcessPID } = ptyProcess;
      process.kill(ptyProcessPID, 'SIGHUP');
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

export default createXTermSocketChannel;