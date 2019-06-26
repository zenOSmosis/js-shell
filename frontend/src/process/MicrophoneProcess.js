import ClientAudioProcess, {
  OUTPUT_DATA_TYPE_FLOAT32ARRAY,
  OUTPUT_DATA_TYPE_AUDIOBUFFER,
  OUTPUT_DATA_TYPES
} from 'process/ClientAudioProcess';

export {
  OUTPUT_DATA_TYPE_FLOAT32ARRAY,
  OUTPUT_DATA_TYPE_AUDIOBUFFER,
  OUTPUT_DATA_TYPES
};

export const NUM_INPUT_CHANNELS = 1;
export const NUM_OUTPUT_CHANNELS = 1;

/**
 * Binds the native microphone to a ClientProcess.
 * 
 * Note, the microphone will attempt to turn on when this class is instantiated
 * and will throw an exception if it cannot do that.
 */
export default class MicrophoneProcess extends ClientAudioProcess {
  constructor(parentProcess, cmd = null, options = {}) {
    super(parentProcess, cmd, options);

    this._micStream = null;
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
  async _startMic() {
    try {
      this._micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this._audioContext = new AudioContext();
      
      this._source = this._audioContext.createMediaStreamSource(this._micStream);

      const { bufferSize } = this._options;
      
      // The createScriptProcessor() method of the BaseAudioContext interface creates a ScriptProcessorNode used for direct audio processing.
      // @see https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createScriptProcessor
      this._scriptNode = this._audioContext.createScriptProcessor(bufferSize, NUM_INPUT_CHANNELS, NUM_OUTPUT_CHANNELS);
  
      this._source.connect(this._scriptNode);
      this._scriptNode.connect(this._audioContext.destination);
  
      this._scriptNode.onaudioprocess = (e) => {
        const audioBuffer = e.inputBuffer;
  
        // Write the audioBuffer to the output
        this._outputAudioBuffer(audioBuffer);
      };
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

      if (!this._micStream) {
        console.warn('_micStream is not available');
      } else {
        // Stop each track
        const tracks = this._micStream.getTracks();

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