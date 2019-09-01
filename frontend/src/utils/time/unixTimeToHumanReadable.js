import moment from 'moment';

/**
 * 
 * @param {number} unixTime 
 * @param {string} format
 * @return {string} 
 */
const unixTimeToHumanReadable = (unixTime, format = 'dddd, MMMM Do, YYYY h:mm:ss A') => {
  return moment.unix(unixTime).format(format);
};

export default unixTimeToHumanReadable;