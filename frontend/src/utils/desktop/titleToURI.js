/**
 * Converts a title into a pretty URL.
 * 
 * This works in contrast to a URL-encoded string.
 * 
 * @param {string} title 
 */
const titleToURL = (title) => {  
  return title.split(' ').join('-');
};

export default titleToURL;