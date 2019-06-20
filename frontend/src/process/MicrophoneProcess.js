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
    super(parentProcess, async (proc) => {
      try {
        this._outputSampleRate = null;
        this._micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        proc.setImmediate(() => {
          proc._handleMicStream(this._micStream);
        
          // Run passed cmd, if available
          if (typeof cmd === 'function') {
            cmd(proc);
          }
        });
      } catch (exc) {
        throw exc;
      }
    }, options);
  }

  /**
   * @see https://aws.amazon.com/blogs/machine-learning/capturing-voice-input-in-a-browser/
   */
  _handleMicStream(micStream) {
    // TODO: resample @see https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext/OfflineAudioContext
    // TODO: @see https://mdn.github.io/webaudio-examples/offline-audio-context/


    const context = new AudioContext();
    // Attach context as class property
    this._audioContext = context;
    
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

  getOutputSampleRate() {
    return this._outputSampleRate;
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