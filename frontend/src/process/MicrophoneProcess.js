import ClientProcess from 'process/ClientProcess';

/**
 * Binds the native microphone to a ClientProcess.
 * 
 * Note, the microphone will attempt to turn on when this class is instantiated
 * and will throw an exception if it cannot do that.
 */
export default class MicrophoneProcess extends ClientProcess {
  _micStream = null;

  constructor(parentProcess) {
    super(parentProcess, async (proc) => {
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        proc._handleMicStream(micStream);
      } catch (exc) {
        throw exc;
      }
    });
  }
  
  _handleMicStream(micStream) {
    // Write mic stream to stdout
    this.stdout.write(micStream);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop
   */
  _stopMic() {
    if (!this._micStream) {
      return;
    }

    // Stop each track
    const tracks = this._micStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
  }

  async kill(killSignal = 0) {
    this._stopMic();

    await super.kill(killSignal);
  }
}