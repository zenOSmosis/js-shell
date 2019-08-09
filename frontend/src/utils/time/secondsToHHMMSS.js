
function pad(num) {
  return ("0" + num).slice(-2);
}

/**
 * @see https://stackoverflow.com/questions/31337370/how-to-convert-seconds-to-hhmmss-in-moment-js
 * 
 * @param {number} seconds
 * @return {string} hh:mm:ss format
 */
function secondsTOHHMMSS(secs) {
  let minutes = Math.floor(secs / 60);
  secs = secs % 60;
  const hours = Math.floor(minutes / 60)
  minutes = minutes % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

export default secondsTOHHMMSS;