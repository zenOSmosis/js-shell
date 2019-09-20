/**
 * This module currently depends on the searx backend, which is available in the
 * Docker Compose configuration.
 */

const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');
const axios = require('axios');
const urlencode = require('urlencode');
require('../typedefs');

/**
 * TODO: Move this to
 * 
 * @param {SearxSearchOptions} queryOptions
 * @return {Promise<SearxResponse[]>}
 */
const _fetchQueryResults = async (queryOptions) => {
  try {
    const { query } = queryOptions;

    // TODO: Switch to POST; remove hardcoded categories
    const res = await axios.get(`http://searx:8080?q=${urlencode(query)}&categories=videos&format=json`);

    const { data: searxResponse } = res;

    return searxResponse;
  } catch (exc) {
    throw exc;
  }
};

/**
 * @param {SearxSearchOptions} options // TODO: Document 
 * @return {Promise<void>}
 */
const webSearch = async (options, ack) => {
  return await handleSocketAPIRoute(async () => {
    try {
      return await _fetchQueryResults(options);
    } catch (exc) {
      throw exc;
    }
  }, ack);
};

module.exports = webSearch;