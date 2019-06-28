import R_ClientWorkerProcess from '../ClientWorkerProcess/R_ClientWorkerProcess';

/**
 * Native process Float32AudioWorker.
 */
export default class R_Float32AudioWorker extends R_ClientWorkerProcess {
  getAverage(float32Array) {
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