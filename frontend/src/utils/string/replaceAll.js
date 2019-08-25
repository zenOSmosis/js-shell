
/**
 * Replace all occurrences the a sub-string of a string with another string.
 *
 * @see https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string
 *  
 * @param {string} string 
 * @param {string} search 
 * @param {string} replace
 * @return {string} A new string 
 */
const replaceAll = (string, search, replace) => {
  return string.replace(string, new RegExp(search, 'g'), replace);
};

export default replaceAll;