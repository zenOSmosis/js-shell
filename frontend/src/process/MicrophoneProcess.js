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

  constructor(parentProcess, cmd = null, options = {}) {
    super(parentProcess, null, options);

    this._outputSampleRate = null;
    this._micStream = null;
    this._deferredCmd = cmd;
  }

  _init() {
    this.setImmediate(async () => {
      this._micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this._handleMicStream(this._micStream);

      super._init();

      if (typeof this._deferredCmd === 'function') {
        this._deferredCmd(this);
      }
    });
  }

  /**
   * @see https://aws.amazon.com/blogs/machine-learning/capturing-voice-input-in-a-browser/
   */
  _handleMicStream(micStream) {
    this._audioContext = new AudioContext();
    const context = this._audioContext;
    const source = context.createMediaStreamSource(micStream);

    const { bufferSize } = this._options;
    const numberOfInputChannels = 1;
    const numberOfOutputChannels = 1;
    
    // The createScriptProcessor() method of the BaseAudioContext interface creates a ScriptProcessorNode used for direct audio processing.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createScriptProcessor
    const processor = context.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);

    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = (e) => {
      const audioBuffer = e.inputBuffer;

      // Write AudioBuffer to stdout stream
      this.stdout.write(audioBuffer);
    };
  }

  // TODO: Move out(?)
  getOutputSampleRate() {
    return this._outputSampleRate;
  }

  getAudioContext() {
    return this._audioContext;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop
   */
  _stopMic() {
    if (!this._micStream) {
      console.warn('_micStream is not available');
      return;
    }

    // Stop each track
    const tracks = this._micStream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });

    console.warn('TODO: Debug why mic is not stopping');
  }

  async kill(killSignal = 0) {
    this._stopMic();

    if (this._audioContext) {
      // TODO: Verify the processor is destroyed with the AudioContext instance
      await this._audioContext.close();
    }

    await super.kill(killSignal);
  }
}