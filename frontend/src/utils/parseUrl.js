/**
 * @typedef {Object} ParsedUrl
 * @property {string} protocol e.g "https:"
 * @property {string} hostname e.g. "example.com"
 * @property {number} port e.g. 3000
 * @property {string} pathName e.g. "/pathname/"
 * @property {string} search e.g. "?search=test"
 * @property {string} hash e.g. "#hash"
 * @property {string} host e.g. "example.com:3000" 
 */

/**
 * @param {string} url
 * @return {ParsedUrl}
 */
const parseUrl = (url) => {
  let parser = document.createElement('a');
  parser.href = url;

  const {
    protocol,
    hostname,
    port,
    pathname: pathName,
    search,
    hash,
    host
  } = parser;

  // Force nullification of parser element (in case the browser doesn't dispose
  // it on its own)
  parser = null;

  return {
    protocol,
    hostname,
    port,
    pathname: pathName,
    search,
    hash,
    host
  };
};

export default parseUrl;