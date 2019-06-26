import ClientProcess from 'process/ClientProcess';

export const OUTPUT_DATA_TYPE_FLOAT32ARRAY = 'Float32Audio';
export const OUTPUT_DATA_TYPE_AUDIOBUFFER = 'AudioBuffer';
export const OUTPUT_DATA_TYPES = [
  OUTPUT_DATA_TYPE_FLOAT32ARRAY,
  OUTPUT_DATA_TYPE_AUDIOBUFFER
];

export const EVT_AUDIO_BUFFER_OUTPUT = 'audioBuffer';

/**
 * Binds the native microphone to a ClientProcess.
 * 
 * Note, the microphone will attempt to turn on when this class is instantiated
 * and will throw an exception if it cannot do that.
 */
export default class ClientAudioProcess extends ClientProcess {
  constructor(parentProcess, cmd = null, options = {}) {
    // Default options
    const defOptions = {
      outputDataType: OUTPUT_DATA_TYPE_FLOAT32ARRAY
    }

    options = Object.assign({}, defOptions, options);
    
    super(parentProcess, cmd, options);
  }

  /**
   * Writes audioBuffer to stdout.
   * 
   * @param { AudioBuffer } audioBuffer 
   */
  _outputAudioBuffer(audioBuffer) {
    this.emit(EVT_AUDIO_BUFFER_OUTPUT, audioBuffer);

    const { outputDataType } = this._options;

    if (outputDataType === OUTPUT_DATA_TYPE_FLOAT32ARRAY) {
      // Assuming a mono-channel
      this.stdout.write(audioBuffer.getChannelData(0)); // Float32Audio

    } else if (outputDataType === OUTPUT_DATA_TYPE_AUDIOBUFFER) {
      this.stdout.write(audioBuffer); // AudioBuffer

    } else {
      throw new Error(`Unhandled output data type: ${outputDataType}`);
    }
  }

  /**
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
}