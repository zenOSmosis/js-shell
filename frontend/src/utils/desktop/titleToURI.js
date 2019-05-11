/**
 * Converts a title into a pretty URI.
 * 
 * This works in contrast to a URI-encoded string.
 * 
 * @param {string} title 
 */
const titleToURI = (title) => {
  return title.split(' ').join('-');
};

export default titleToURI;