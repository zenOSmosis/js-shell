import ClientWorkerProcess from '../ClientWorkerProcess/ClientWorkerProcess';

/**
 * Native process ClientAudioWorkerProcess.
 */
export default class ClientAudioWorkerProcess extends ClientWorkerProcess {
  constructor(...args) {
    super(...args);

    // Used internally by the this.downsampleL16 method
    this._downsamplerF32Unused = new Float32Array(0);
  }

  /**
   * Converts the given float32Array to a PCM 16, 16-khz ... audio blob,
   * optimized for human voice transmission.
   * 
   * @param {Float32Array} float32Array A mono (1 channel) RAW audio container
   * @return {Blob} Blob with mime type of audio/pcm 
   */
  float32ToPCM16AudioBlob(float32Array) {
    const pcm16 = (this.float32ToInt16(this.downsampleL16(float32Array)));
    const audioBlob =  new Blob([pcm16], {
      type: 'audio/pcm'
    });
    return audioBlob;
  }

  // TODO: Doc from Amazon Lex(?)
  /**
   * @param {Float32Array} float32Array A mono (1 channel) RAW audio container
   */
  float32ToInt16(float32Array) {
    let l = float32Array.length;
    const i16 = new Int16Array(l);

    while (l--) {
      i16[l] = float32Array[l] * 0xFFFF; // convert to 16 bit
    }

    return i16.buffer;
  }

  // TODO: Doc from IBM Watson
  // TODO: Acquire inputSampleRate & outputSampleRate from this.options, if they are
  // not set throw an error
  /**
   * 
   * @param {Float32Array} float32Array A mono (1 channel) RAW audio container
   */
  downsampleL16(float32Array) {
    const { inputSampleRate, outputSampleRate } = this._options;

    if (!inputSampleRate || !outputSampleRate) {
      console.warn('Input and output sample rates must be defined in options', this._options);

      // Gracefully handle
      return new Float32Array(0);
    }

    // TODO: Convert all let to const / let; etc.

    let buffer = null;
    const newSamples = float32Array.length;
    const unusedSamples = this._downsamplerF32Unused.length;
    let i = 0;
    let offset = 0;
    if (unusedSamples > 0) {
      buffer = new Float32Array(unusedSamples + newSamples);
      for (i = 0; i < unusedSamples; ++i) {
        buffer[i] = this._downsamplerF32Unused[i];
      }
      for (i = 0; i < newSamples; ++i) {
        buffer[unusedSamples + i] = float32Array[i];
      }
    } else {
      buffer = float32Array;
    }
    // Downsampling and low-pass filter:
    // Input audio is typically 44.1kHz or 48kHz, this downsamples it to 16kHz.
    // It uses a FIR (finite impulse response) Filter to remove (or, at least attinuate) 
    // audio frequencies > ~8kHz because sampled audio cannot accurately represent  
    // frequiencies greater than half of the sample rate. 
    // (Human voice tops out at < 4kHz, so nothing important is lost for transcription.)
    // See http://dsp.stackexchange.com/a/37475/26392 for a good explination of this code.
    let filter = [
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

    let samplingRateRatio = inputSampleRate / outputSampleRate;

    let nOutputSamples = Math.floor((buffer.length - filter.length) / samplingRateRatio) + 1;
    let outputBuffer = new Float32Array(nOutputSamples);
    for (i = 0; i + filter.length - 1 < buffer.length; i++) {
      offset = Math.round(samplingRateRatio * i);
      let sample = 0;
      for (let j = 0; j < filter.length; ++j) {
        sample += buffer[offset + j] * filter[j];
      }
      outputBuffer[i] = sample;
    }
    let indexSampleAfterLastUsed = Math.round(samplingRateRatio * i);
    let remaining = buffer.length - indexSampleAfterLastUsed;
    if (remaining > 0) {
      this._downsamplerF32Unused = new Float32Array(remaining);
      for (i = 0; i < remaining; ++i) {
        this._downsamplerF32Unused[i] = buffer[indexSampleAfterLastUsed + i];
      }
    } else {
      this._downsamplerF32Unused = new Float32Array(0);
    }
    return outputBuffer;
  }

  getAverage(binaryArray) {
    // sum all the elements of the array
    const sum = binaryArray.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    });

    const average = sum / binaryArray.length;

    return average;
  }

  /**
   * Uses this.getFrameAverage() to obtain an average percent, as a float.
   * 
   * @param {Float32Array | Int16Array | []} binaryArray 
   * @return {number} Any value between 0 and 1
   */
  /*
  getPercent(binaryArray) {
    const average = this.getAverage(binaryArray);

    const percent = ((average + 1) / 2);

    return percent;
  }
  */

  /**
   * 
   * @param {Float32Array | Int16Array | []} binaryArray 
   */
  getMax(binaryArray) {
    const max = binaryArray.reduce((a, b) => {
      return (a > b ? a : b);
    });

    return max;
  }
}