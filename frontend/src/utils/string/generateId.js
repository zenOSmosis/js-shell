// @see https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/1349462

// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
const _dec2hex = (dec) => {
  return ('0' + dec.toString(16)).substr(-2);
}

// generateId :: Integer -> String
/**
 * @param {number} len?
 * @return {string}
 */
const generateId = (len = 40) => {
  var arr = new Uint8Array((len) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, _dec2hex).join('');
};

export default generateId;