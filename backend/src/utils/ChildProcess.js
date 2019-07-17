const EventEmitter = require('events');
var {spawn} = require('child_process');
// @see https://nodejs.org/api/child_process.html#child_process_child_process

class ChildProcess extends EventEmitter {
  constructor(command, args = []) {
    super();

    this.ls = null;
    this.stdout = null;
    this.stderr = null;
    this.isConnected = false;
    this.isClosed = false;
    this.exitCode = null;

    this.ls = ((command, args) => {
      const ls = spawn(command, args);

      console.log(ls);
      
      // TODO: Capture spawn information
      this.emit('spawn');

      ls.stdout.on('data', (data) => {
        this.stdout = data;
        this.emit('stdout', data);
      });
      
      ls.stderr.on('data', (data) => {
        this.stderr = data;
        this.emit('stderr', data);
      });
      
      ls.on('close', (exitCode) => {
        // console.log(`child process exited with code ${code}`);

        this.isClosed = true;
        this.exitCode = exitCode;
        this.emit('close', exitCode);
      });

      return ls;
    })(command, args);
  }

  /**
   * Overview of signals:
   * @see http://man7.org/linux/man-pages/man7/signal.7.html 
   */
  kill(signal = 'SIGTERM') {
    this.ls.kill(signal);
  }
}

module.exports = ChildProcess;