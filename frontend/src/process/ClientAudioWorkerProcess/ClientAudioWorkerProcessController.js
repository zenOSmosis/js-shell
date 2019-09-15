import ClientWorkerProcessController from '../ClientWorkerProcess';

/**
 * Processes Float32Array audio in a native Web Worker.
 * 
 * The Float32Array typed array represents an array of 32-bit floating point
 * numbers (corresponding to the C float data type) in the platform byte order.
 * 
 * If control over byte order is needed, use DataView instead. The contents are
 * initialized to 0. Once established, you can reference elements in the array
 * using the object's methods, or using standard array index syntax (that is,
 * using bracket notation).
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Audio
 * 
 * For endianess, etc:
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView#Endianness
 * 
 * @extends ClientWorkerProcessController
 */
class ClientAudioWorkerProcessController extends ClientWorkerProcessController {
  constructor(parentProcess, cmd = null, options = {}) {
    // Default options
    const defOptions = {
      // The non-instantiated class of the Worker implementation
      DispatchWorker: new Worker('./dispatch.worker.js', { type: 'module' }),

      outputSampleRate: 16000,
      // inputSampleRate: 48000 // Should be overridden by passed options
    };

    options = {...defOptions, ...options};

    super(parentProcess, cmd, options);
  }
}

export default ClientAudioWorkerProcessController;