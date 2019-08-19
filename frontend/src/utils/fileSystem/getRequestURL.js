import config from 'config';

/**
 * Converts an absolute server file path into a requestable HTTP URL.
 * 
 * @param {string} serverResourcePath
 * @return {string}
 */
const getRequestURL = (serverResourcePath) => {
  return `${config.HOST_REST_URL}/files?filePath=${serverResourcePath}`;
};

export default getRequestURL;