import path from 'path';

/**
 * @return {string} Either "/" (on Unix-like) or "\" (on Windows)
 */
const getPathSeparator = () => {
  const { sep } = path;

  return sep;
};

export default getPathSeparator;