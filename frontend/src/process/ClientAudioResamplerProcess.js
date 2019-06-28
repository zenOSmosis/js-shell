import ClientAudioProcess from './ClientAudioProcess';
import { EVT_PIPE_DATA } from './ClientProcess';

/**
 * TODO: Use R_Float32AudioWorker instead, or as a fallback....
 */
export default class ClientAudioResamplerProcess extends ClientAudioProcess {
  constructor(parentProcess, cmd = null, options = {}) {
    // defaults
    const defOptions = {
      outputTargetSampleRate: 16000
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
}