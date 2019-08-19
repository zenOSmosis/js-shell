// This file should be included when the Node.js server starts, in order to
// effectively monitor its uptime

let _startTime = null;

// TODO: Export to common utility shared between server & client
const _getUnixTime = () => {
  const date = new Date();
  const unixTime = Math.round(date.getTime() / 1000);

  return unixTime;
};

/**
 * Should be invoked when the Node.js server starts.
 */
(() => {
  _startTime = _getUnixTime();
})();

/**
 * @return {number}
 */
const getStartTime = () => {
  return _startTime;
};

/**
 * @return {number}
 */
const getNodeUptime = () => {
  if (!_startTime) {
    throw new Error('_startTime is not set');
  }

  const now = _getUnixTime();

  return now - _startTime;
};

export default getNodeUptime;
export {
  getStartTime
};