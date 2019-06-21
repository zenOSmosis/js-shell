import ClientWorkerProcess from '../ClientWorkerProcess';

/**
 * Processes Float32Array in a native Worker.
 * 
 * The Float32Array typed array represents an array of 32-bit floating point
 * numbers (corresponding to the C float data type) in the platform byte order.
 * 
 * If control over byte order is needed, use DataView instead. The contents are
 * initialized to 0. Once established, you can reference elements in the array
 * using the object's methods, or using standard array index syntax (that is,
 * using bracket notation).
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array
 * 
 * For endianess, etc:
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView#Endianness
 */
export default class Float32ArrayWorker extends ClientWorkerProcess {
  /*
  // Note: This is a prototype implementation until the architecture is more nailed down
  constructor(parentProcess, cmd = null, options = {}) {
    super(parentProcess, (worker) => {

      worker.getAverage = (float32Array) => {
        // Turn Float32Array into regular array

        // sum all the elements of the array
        const sum = float32Array.reduce(function (accumulator, currentValue){
          return accumulator + currentValue;
        });

        const average = sum / arr.length;

        return average;
      }

      worker.getPercent = (float32Array) => {
        const average = worker.getAverage(float32Array);

        const percent = ((average + 1) / 2);

        return percent;
      }

      if (typeof cmd === 'function') {
        cmd(worker);
      }
    }, options);
  }
  */
}