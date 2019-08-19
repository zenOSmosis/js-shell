import path from 'path';

/**
 * Retrieves absolute path for scripts directory in project root.
 * 
 * @return {string}
 */
const getRootScriptsPath = () => {
  return path.resolve(__dirname, '..', '..', '..', 'scripts');
};

export default getRootScriptsPath;