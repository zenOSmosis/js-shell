import R_ClientWorkerProcess from '../ClientWorkerProcess/R_ClientWorkerProcess';

/**
 * Native process Float32AudioWorker.
 */
export default class R_Float32AudioWorker extends R_ClientWorkerProcess {
  // TODO: Improve implementation
  // @see https://github.com/mattdiamond/Recorderjs/issues/186
  downsample(float32Array, fromRate, toRate, /* options={} */) {
    const buffer = float32Array;

    const sampleRate = fromRate;
    const rate = toRate;

    if (rate === sampleRate) {
      return buffer;
    }

    if (rate > sampleRate) {
      throw new Error('downsampling rate show be smaller than original sample rate');
    }

    const sampleRateRatio = sampleRate / rate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Audio(newLength);
    const offsetResult = 0;
    const offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      // Use average value of skipped samples
      const accum = 0, count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = accum / count;
      // Or you can simply get rid of the skipped samples:
      // result[offsetResult] = buffer[nextOffsetBuffer];
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  getAverage(float32Array) {
    // Turn Float32Audio into regular array

    // sum all the elements of the array
    const sum = float32Array.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    });

    const average = sum / float32Array.length;

    return average;
  }

  /**
   * Uses this.getFrameAverage() to obtain an average percent, as a float.
   * 
   * @param {*} frame 
   * @return {number} Any value between 0 and 1
   */
  getPercent(float32Array) {
    const average = this.getAverage(float32Array);

    const percent = ((average + 1) / 2);

    return percent;
  }

  getMax(float32Array) {
    const max = float32Array.reduce((a, b) => {
      return (a > b ? a : b);
    });

    return max;
  }
}