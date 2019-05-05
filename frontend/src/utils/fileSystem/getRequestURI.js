import config from 'config';

/**
 * Converts an absolute server file path into a requestable HTTP URI.
 * 
 * @param {string} serverResourcePath
 * @return {string}
 */
const getRequestURI = (serverResourcePath) => {
  return `${config.HOST_REST_URI}/files?filePath=${serverResourcePath}`;
};

export default getRequestURI;