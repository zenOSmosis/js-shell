let _io = null;

/**
 * @param {SocketIO} io 
 */
const _setIO = (io) => {
  _io = io;
};

export default _setIO;

/**
 * @return {SocketIO}
 */
export const _getIO = () => {
  return _io;
};