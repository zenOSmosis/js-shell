/**
 * @see https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
 * 
 * @param {number} seconds 
 */
const secondsTOHHMMSS = (seconds) => {
  return new Date(seconds).toISOString().substr(11, 8);
};

export default secondsTOHHMMSS;