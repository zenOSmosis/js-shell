import { EVT_PIPE_DATA } from './ClientProcess';
import ClientProcess from './ClientProcess';

// TODO: If removing this dependency, ensure it is removed from node_modules
import Recorder from 'recorderjs';

/**
 * https://github.com/mattdiamond/Recorderjs
 *
 * This might be a more modernized approach:
 * @see https://blog.addpipe.com/using-webaudiorecorder-js-to-record-audio-on-your-website/
 */
export default class PCMAudioRecorderProcess extends ClientProcess {
  constructor(parentProcess) {
    // Intentionally initializing super() without proc function, for this
    // PCMAudioRecorderProcess implementation
    super(parentProcess);

    // TODO: Build this out

    this.stdin.on(EVT_PIPE_DATA, (stream) => {
      // console.warn('TODO: Process stdin stream', stream);

      // TODO: Throw error if stdin is called more than once

      const rec = new Recorder(stream);
      console.warn('TODO: Implement recorder', rec);

      // TODO: Handle stdin

      // Pass processed stream data to stdout
      // this.stdout.write('...')
    });
  }

  async kill(killSignal = 0) {
    console.warn('TODO: Implement stopping of recorderjs, etc.');

    await super.kill(killSignal);
  }
}