import ClientAudioProcess from './ClientAudioProcess';

/**
 * Binds the native microphone to a ClientAudioProcess.
 * 
 * Note, the microphone will attempt to turn on when this class is instantiated
 * and will throw an exception if it cannot do that.
 *
 * @extends ClientAudioProcess
 */
class MicrophoneProcess extends ClientAudioProcess {
  constructor(parentProcess, cmd = null, options = {}) {
    super(parentProcess, cmd, options);

    this._audioContext = null;
    this._scriptNode = null;
    this._source = null;
  }

  async _init() {
    try {
      await this._startMic();

      await super._init();
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * @see https://aws.amazon.com/blogs/machine-learning/capturing-voice-input-in-a-browser/
   */
  // TODO: Rename to _startMic();
  // TODO: @see https://github.com/saebekassebil/microphone-stream#readme
  async _startMic() {
    try {
      // TODO: Make these options confiurable via this._options
      const mediaOptions = {
        /*
        // Borrowed from screen capture tutorial (even though this class is fully audio)
        // @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture
        // Notes: When using STT (Homayoon), it seems (at least on of) these
        // options adversely affect the speech recognition
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
        */
       // or
       audio: true
      };

      this._outputStream = await navigator.mediaDevices.getUserMedia(mediaOptions);
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop
   */
  async _stopMic() {
    try {
      await this._audioContext.close();

      if (!this._outputStream) {
        console.warn('_outputStream is not available');
      } else {
        // Stop each track
        const tracks = this._outputStream.getTracks();

        tracks.forEach((track) => {
          track.stop();
        });
      }

      this._scriptNode.disconnect(this._audioContext.destination);
      this._source.disconnect(this._scriptNode);
    } catch (exc) {
      throw exc;
    }
  }

  async kill(killSignal = 0) {
    try {
      await this._stopMic();
  
      await super.kill(killSignal);
    } catch (exc) {
      throw exc;
    }
  }
}

export default MicrophoneProcess;