// @see https://gist.github.com/steinwaywhw/9920493

const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');
const { SocketChannel } = require('utils/socketAPI/SocketChannel');
const os = require('os');
const pty = require('node-pty');
// const terminal = require('term.js');
const fs = require('fs');

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const createXTermSocketChannel = async(options = {}, ack) => {
  return handleSocketAPIRoute(() => {
    const { socket } = options;
    
    const socketChannel = new SocketChannel(socket);
    const socketChannelID = socketChannel.getChannelID();

    // create shell process
	  var ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env
    });

    // store term's output into buffer or emit through socket
    ptyProcess.on('data', (data) => {
      socketChannel.write(data);
    });

    socketChannel.on('data', (data) => {
			ptyProcess.write(data);
    });
    
    socketChannel.on('disconnect', () => {
      ptyProcess.kill();
    });

    // console.log('socketChannelID', socketChannelID);

    return{
      socketChannelID
    };

    // return new Date();
  }, ack);
};

module.exports = createXTermSocketChannel;