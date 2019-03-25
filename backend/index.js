var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// @see https://nodejs.org/api/child_process.html
// var exec = require('child_process').exec;
const LinuxGPUChildProcess = require('./utils/linux/LinuxGPUChildProcess');
const {fetchFreedesktopApps} = require('./utils/freedesktop/appUtils');

const HTTP_LISTEN_PORT = 3001;

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(socket);

  socket.on('request-app-list', async (options = {}, ack) => {
    try {
      const apps = await fetchFreedesktopApps();

      ack(apps);
    } catch (exc) {
      // TODO: Pipe this up to ack
      throw exc;
    }
  });

  socket.on('sys-command', (commandData, ack) => {
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

  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(HTTP_LISTEN_PORT, () => {
  console.log(`listening on *:${HTTP_LISTEN_PORT}`);
});