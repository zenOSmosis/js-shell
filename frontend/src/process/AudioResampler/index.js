import ClientProcess, { EVT_PIPE_DATA } from '../ClientProcess';

export const OUTPUT_DATA_TYPE_FLOAT32ARRAY = 'Float32Audio';
export const OUTPUT_DATA_TYPE_AUDIOBUFFER = 'AudioBuffer';
export const OUTPUT_DATA_TYPES = [
  OUTPUT_DATA_TYPE_FLOAT32ARRAY,
  OUTPUT_DATA_TYPE_AUDIOBUFFER
];

/**
 * TODO: Use R_Float32AudioWorker instead, or as a fallback....
 */
export default class AudioResamplerProcess extends ClientProcess {
  constructor(parentProcess, cmd = null, options = {}) {
    // defaults
    const defOptions = {
      outputDataType: OUTPUT_DATA_TYPE_AUDIOBUFFER,
      outputTargetSampleRate: 44000
    };

    options = Object.assign({}, defOptions, options);

    super(parentProcess, (proc) => {
      proc.stdin.on(EVT_PIPE_DATA, (audioBuffer) => {
        const { outputTargetSampleRate } = this._options;

        const numCh_ = audioBuffer.numberOfChannels;
        const numFrames_ = audioBuffer.length * outputTargetSampleRate / audioBuffer.sampleRate;
    
        // TODO: Creating a new OfflineAudioContext on each buffer is
        // inefficient and will probably lead to choppy audio
        const offlineContext_ = new OfflineAudioContext(numCh_, numFrames_, outputTargetSampleRate);
        const bufferSource_ = offlineContext_.createBufferSource();
        bufferSource_.buffer = audioBuffer;
    
        offlineContext_.oncomplete = (event) => {
          const resampledAudioBuffer = event.renderedBuffer;
          
          // Write to output buffer
          this._outputAudioBuffer(resampledAudioBuffer);
        };
    
        // console.debug('Starting Offline Rendering');
        bufferSource_.connect(offlineContext_.destination);
        bufferSource_.start(0);
        offlineContext_.startRendering();
      });

      if (typeof cmd === 'function') {
        // Execute command in process scope
        cmd(proc);
      }
    }, options);
  }

  /**
   * Writes audioBuffer to stdout.
   * 
   * @param { AudioBuffer } audioBuffer 
   */
  _outputAudioBuffer(audioBuffer) {
    const { outputDataType } = this._options;

    if (outputDataType === OUTPUT_DATA_TYPE_FLOAT32ARRAY) {
      this.stdout.write(audioBuffer.getChannelData(0)); // Float32Audio

    } else if (outputDataType === OUTPUT_DATA_TYPE_AUDIOBUFFER) {
      this.stdout.write(audioBuffer); // AudioBuffer

    } else {
      throw new Error(`Unhandled output data type: ${outputDataType}`);
    }
  }
}