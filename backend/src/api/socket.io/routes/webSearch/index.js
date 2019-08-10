/**
 * This module currently depends on the searx backend, which is available in the
 * Docker Compose configuration.
 */

const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');
const axios = require('axios');
const urlencode = require('urlencode');

/**
 * TODO: Move to a common place
 * 
 * @typedef {Object} WebSearchQueryResult
 * @property {string} url
 * @property {string} thumbnail
 * @property {string} title
 * @property {string} content
 * @property {string} template
 * @property {string} publishedDate
 */

 /**
  * @param {Object} options // TODO: Document 
  * @return {Promise<WebSearchQueryResult[]>}
  */
const webSearch = async(options = {}, ack) => {
  return handleSocketAPIRoute(async () => {
    try {
      const { query } = options;

      // TODO: Switch to POST; remove hardcoded categories
      const res = await axios.get(`http://searx:8080?q=${urlencode(query)}&categories=videos&format=json`);

      const { data: rawQueryResults } = res;
      
      if (rawQueryResults) {
        const { results } = rawQueryResults;

        return results;
      }
    } catch (exc) {
      throw exc;
    }
  }, ack);
};

module.exports = webSearch;