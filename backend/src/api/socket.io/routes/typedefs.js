// SocketAPI shared typedefs between server and client

/**
 * @typedef {Object} SearxSearchOptions
 * @property {string} query
 */

/**
 * @typedef {Object} SearxResponse
 * @property {SearxResponseResult[]} results
 * @property {SearxResponseUnresponsiveEngine[]} unresponsive_engines 
 */

/**
 * @typedef {[]} SearxResponseUnresponsiveEngine
 * @property {string} keySearchEngineName
 * @property {string} keyErrorReason
 */

 /**
 * @typedef {Object} SearxResponseResult
 * @property {string} url
 * @property {string} thumbnail
 * @property {string} title
 * @property {string} content
 * @property {string} template
 * @property {string} publishedDate
 */