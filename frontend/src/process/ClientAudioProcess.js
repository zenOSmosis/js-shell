// TODO: Should this be renamed to ClientAudioInputProcess?

import ClientProcess from 'process/ClientProcess';

export const NUM_INPUT_CHANNELS = 1; // TODO: Read from input stream, instead
export const NUM_OUTPUT_CHANNELS = 1;

export const OUTPUT_DATA_TYPE_AUDIOBUFFER = 'AudioBuffer';
export const OUTPUT_DATA_TYPE_FLOAT32ARRAY = 'Float32Array';
export const OUTPUT_DATA_TYPE_UINT16AARRAY = 'Uint16Array';
export const OUTPUT_DATA_TYPE_UINT8ARRAY = 'Uint8Array';
export const OUTPUT_DATA_TYPES = [
  OUTPUT_DATA_TYPE_AUDIOBUFFER,
  OUTPUT_DATA_TYPE_FLOAT32ARRAY,
  OUTPUT_DATA_TYPE_UINT16AARRAY,
  OUTPUT_DATA_TYPE_UINT8ARRAY
];

export const EVT_AUDIO_BUFFER_OUTPUT = 'audioBuffer';

/**
 * @extends ClientProcess
 * 
 * Base class for Web Audio API / ClientProcess bridging.
 */
class ClientAudioProcess extends ClientProcess {
  constructor(parentProcess, cmd = null, options = {}) {
    // Default options
    const defOptions = {
      outputDataType: OUTPUT_DATA_TYPE_AUDIOBUFFER,

      outputAudioBufferSize: 256 * 4 * 8
    };

    options = { ...defOptions, ...options };

    super(parentProcess, cmd, options);

    // TODO: Rename to inputStream
    this._outputStream = null;
  }

  async _init() {
    try {
      this._initAudioContext();

      await super._init();
    } catch (exc) {
      throw exc;
    }
  }

  // TODO: Rename to getInputStream()
  getOutputStream() {
    return this._outputStream;
  }

  _initAudioContext() {
    if (!this._outputStream) {
      console.warn('outputStream is not initialized. Skipping  _initAudioContext', this);
      return;
    }

    this._audioContext = new AudioContext();

    this._source = this._audioContext.createMediaStreamSource(this._outputStream);

    const { outputAudioBufferSize } = this._options;

    // TODO: Read input stream to determine number of input channels
    // The createScriptProcessor() method of the BaseAudioContext interface creates a ScriptProcessorNode used for direct audio processing.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createScriptProcessor
    this._scriptNode = this._audioContext.createScriptProcessor(outputAudioBufferSize, NUM_INPUT_CHANNELS, NUM_OUTPUT_CHANNELS);

    this._source.connect(this._scriptNode);
    this._scriptNode.connect(this._audioContext.destination);

    this._scriptNode.onaudioprocess = (e) => {
      const audioBuffer = e.inputBuffer;

      // Write the audioBuffer to the output
      this._outputAudioBuffer(audioBuffer);
    };
  }

  /**
   * Writes audioBuffer to stdout, in whatever format is chosen in the class'
   * outputDataType.
   * 
   * @param { AudioBuffer } audioBuffer 
   */
  _outputAudioBuffer(audioBuffer) {
    this.emit(EVT_AUDIO_BUFFER_OUTPUT, audioBuffer);

    const { outputDataType } = this._options;

    // TODO: Use switch statement for outputDataType

    if (outputDataType === OUTPUT_DATA_TYPE_AUDIOBUFFER) {
      this.stdout.write(audioBuffer); // AudioBuffer

    } else if (outputDataType === OUTPUT_DATA_TYPE_FLOAT32ARRAY) {
      // Note: This is currently the most efficient way of sending the buffer
      // because it is the navie format which browsers use.

      // Assuming a mono-channel
      this.stdout.write(audioBuffer.getChannelData(0)); // Float32Audio

    } else if (outputDataType === OUTPUT_DATA_TYPE_UINT16AARRAY) {
      // Assuming a mono-channel
      const f32 = audioBuffer.getChannelData(0); // Float32Audio

      // @see https://stackoverflow.com/questions/25839216/convert-float32array-to-int16array
      // TODO: Can w/ optimize this by rewriting the array, and setting it as a class prop?
      const i16 = new Uint16Array(f32.buffer);

      this.stdout.write(i16);

    } else if (outputDataType === OUTPUT_DATA_TYPE_UINT8ARRAY) {
      // Assuming a mono-channel
      const f32 = audioBuffer.getChannelData(0); // Float32Audio

      // @see https://stackoverflow.com/questions/25839216/convert-float32array-to-int16array
      // TODO: Can w/ optimize this by rewriting the array, and setting it as a class prop?
      const i8 = new Uint8Array(f32.buffer);

      this.stdout.write(i8);

    } else {
      throw new Error(`Unhandled output data type: ${outputDataType}`);
    }
  }

  /**
   * Fetches the next captured audio buffer.
   * 
   * @return {Promise<AudioBuffer>}
   */
  fetchOutputAudioBuffer() {
    return new Promise((resolve/*, reject*/) => {
      this.once(EVT_AUDIO_BUFFER_OUTPUT, (audioBuffer) => {
        resolve(audioBuffer);
      });
    });
  }

  /**
   * @return {Promise<{}>}
   */
  async fetchOutputAudioFormat() {
    try {
      const outputAudioBuffer = await this.fetchOutputAudioBuffer();

      const {
        duration,
        length,
        numberOfChannels,
        sampleRate
      } = outputAudioBuffer;

      return {
        duration,
        length,
        numberOfChannels,
        sampleRate
      };

    } catch (exc) {
      throw exc;
    }
  }

  /**
   * TODO: Replace w/ fetchOutputFormat
   * 
   * @return {Promise<number>} Integer representing total hertz of the output
   * signal.
   */
  fetchOutputSampleRate() {
    return new Promise((resolve/*, reject*/) => {
      this.once(EVT_AUDIO_BUFFER_OUTPUT, (audioBuffer) => {
        resolve(audioBuffer.sampleRate);
      });
    });
  }

  /**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop
 */
  async _stopAudio() {
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

  async exit(exitSignal = 0) {
    try {
      await this._stopAudio();

      await super.exit(exitSignal);
    } catch (exc) {
      throw exc;
    }
  }
}

export default ClientAudioProcess;