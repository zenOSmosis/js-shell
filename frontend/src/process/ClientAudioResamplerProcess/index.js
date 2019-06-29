import ClientAudioProcess from '../ClientAudioProcess';
import { EVT_PIPE_DATA } from '../ClientProcess';
// import WebAudioL16Stream from './speech-to-text_webaudio-l16-stream';

/**
 * TODO: Use R_Float32AudioWorker instead, or as a fallback....
 * 
 * TODO: @see  https://stackoverflow.com/questions/52817966/how-to-downsample-audio-recorded-from-mic-realtime-in-javascript
 * TODO: @see http://watson-developer-cloud.github.io/speech-javascript-sdk/master/speech-to-text_webaudio-l16-stream.js.html
 */
export default class ClientAudioResamplerProcess extends ClientAudioProcess {
  constructor(parentProcess, cmd = null, options = {}) {
    // defaults
    const defOptions = {
      outputTargetSampleRate: 16000
    };

    options = Object.assign({}, defOptions, options);

    super(parentProcess, cmd, options);

    // Utilized in downsampleL16
    // TODO: Cleanup
    this.bufferUnusedSamples = new Float32Array(0);
  }

  /**
 * Downsamples WebAudio to 16 kHz.
 *
 * Browsers can downsample WebAudio natively with OfflineAudioContext's but it was designed for non-streaming use and
 * requires a new context for each AudioBuffer. Firefox can handle this, but chrome (v47) crashes after a few minutes.
 * So, we'll do it in JS for now.
 *
 * This really belongs in it's own stream, but there's no way to create new AudioBuffer instances from JS, so its
 * fairly coupled to the wav conversion code.
 * 
 * @see http://watson-developer-cloud.github.io/speech-javascript-sdk/master/speech-to-text_webaudio-l16-stream.js.html
 *
 * @param  {Float32Array} bufferNewSamples Microphone/MediaElement audio chunk
 * @return {Float32Array} 'audio/l16' chunk
 */
  downsampleL16(bufferNewSamples) {
    // TODO: Convert all var to const / let; etc.

    var buffer = null;
    var newSamples = bufferNewSamples.length;
    var unusedSamples = this.bufferUnusedSamples.length;
    var i;
    var offset;
    if (unusedSamples > 0) {
      buffer = new Float32Array(unusedSamples + newSamples);
      for (i = 0; i < unusedSamples; ++i) {
        buffer[i] = this.bufferUnusedSamples[i];
      }
      for (i = 0; i < newSamples; ++i) {
        buffer[unusedSamples + i] = bufferNewSamples[i];
      }
    } else {
      buffer = bufferNewSamples;
    }
    // Downsampling and low-pass filter:
    // Input audio is typically 44.1kHz or 48kHz, this downsamples it to 16kHz.
    // It uses a FIR (finite impulse response) Filter to remove (or, at least attinuate) 
    // audio frequencies > ~8kHz because sampled audio cannot accurately represent  
    // frequiencies greater than half of the sample rate. 
    // (Human voice tops out at < 4kHz, so nothing important is lost for transcription.)
    // See http://dsp.stackexchange.com/a/37475/26392 for a good explination of this code.
    var filter = [
      -0.037935,
      -0.00089024,
      0.040173,
      0.019989,
      0.0047792,
      -0.058675,
      -0.056487,
      -0.0040653,
      0.14527,
      0.26927,
      0.33913,
      0.26927,
      0.14527,
      -0.0040653,
      -0.056487,
      -0.058675,
      0.0047792,
      0.019989,
      0.040173,
      -0.00089024,
      -0.037935
    ];
    // var samplingRateRatio = this.options.sourceSampleRate / TARGET_SAMPLE_RATE;
    // TODO: Remove hardcoding
    var samplingRateRatio = 48000 / 16000;

    var nOutputSamples = Math.floor((buffer.length - filter.length) / samplingRateRatio) + 1;
    var outputBuffer = new Float32Array(nOutputSamples);
    for (i = 0; i + filter.length - 1 < buffer.length; i++) {
      offset = Math.round(samplingRateRatio * i);
      var sample = 0;
      for (var j = 0; j < filter.length; ++j) {
        sample += buffer[offset + j] * filter[j];
      }
      outputBuffer[i] = sample;
    }
    var indexSampleAfterLastUsed = Math.round(samplingRateRatio * i);
    var remaining = buffer.length - indexSampleAfterLastUsed;
    if (remaining > 0) {
      this.bufferUnusedSamples = new Float32Array(remaining);
      for (i = 0; i < remaining; ++i) {
        this.bufferUnusedSamples[i] = buffer[indexSampleAfterLastUsed + i];
      }
    } else {
      this.bufferUnusedSamples = new Float32Array(0);
    }
    return outputBuffer;
  }
}