const path = require('path');
const fetchFSNodeDetail = require('./pathDetail');
const ls = require('./ls');

const chdir = async (dirName) => {
  try {
    // Replace double instances of directory separator w/ single
    dirName = dirName.replace(`${path.sep}${path.sep}`, path.sep);

    const dir = await fetchFSNodeDetail(dirName);
    const children = await ls(dirName);

    return Object.assign(dir, {
      children
    });
  } catch (exc) {
    throw exc;
  }
};

module.exports = chdir;