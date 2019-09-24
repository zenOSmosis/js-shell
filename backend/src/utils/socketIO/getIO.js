import { _getIO } from './_setIO';

/**
 * Retrieves the Socket.io object exposed for this cluster worker's instance.
 * 
 * For more details:
 * @see initClusterWorkerAPIServer
 * 
 * @return {SocketIO}
 */
const getIO = () => {
  return _getIO();
};

export default getIO;