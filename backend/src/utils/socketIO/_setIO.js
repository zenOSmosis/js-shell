let _io = null;

const _setIO = (io) => {
  _io = io;
};

export default _setIO;

export const _getIO = () => {
  return _io;
};