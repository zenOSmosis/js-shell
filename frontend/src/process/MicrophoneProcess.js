import ClientProcess from 'process/ClientProcess';

/**
 * Binds the native microphone to a ClientProcess.
 * 
 * Note, the microphone will attempt to turn on when this class is instantiated
 * and will throw an exception if it cannot do that.
 */
export default class MicrophoneProcess extends ClientProcess {
  _micStream = null;
  _audioContext = null;

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
    // this.stdout.write(micStream);

    const context = new AudioContext();
    this._audioContext = context;
    const source = context.createMediaStreamSource(micStream);
    
    // TODO: Make processor values dynamic
    const processor = context.createScriptProcessor(1024, 1, 1);

    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = (e) => {
      // Write AudioBuffer to stdout
      this.stdout.write(e.inputBuffer);
    };
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

    if (this._audioContext) {
      await this._audioContext.close();
    }

    await super.kill(killSignal);
  }
}