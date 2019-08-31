import config from 'config';

/**
 * Converts an absolute server file path into a requestable HTTP URL.
 * 
 * @param {string} serverResourcePath
 * @return {string}
 */
const getFileDownloadRequestURL = (serverResourcePath) => {
  return `${config.HOST_REST_URL}/files?filePath=${urlencode(serverResourcePath)}`;
};

export default getFileDownloadRequestURL;