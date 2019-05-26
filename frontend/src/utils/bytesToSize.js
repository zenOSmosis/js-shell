/**
 * Converts number of bytes to a simplified string.
 * 
 * Borrowed from: https://github.com/paulirish/memory-stats.js/blob/master/memory-stats.js
 * 
 * @param {number} bytes
 * @param {number} nFractDigit
 * @returns {string}
 */
const bytesToSize = (bytes, nFractDigit = undefined) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return 'n/a';
  nFractDigit = nFractDigit !== undefined ? nFractDigit : 0;
  const precision = Math.pow(10, nFractDigit);
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes * precision / Math.pow(1024, i)) / precision + ' ' + sizes[i];
};

export default bytesToSize;