const {fetchWallpaperPaths: doFetchWallpaperPaths} = require('../../../../utils/freedesktop.org/wallpapers');


const fetchWallpaperPaths = async (options = {}, ack) => {
  try {
    console.log('..');
    const wallpaperPaths = await doFetchWallpaperPaths();

    return ack(wallpaperPaths);
  } catch (exc) {
    // TODO: Pipe this up to ack
    throw exc;
  }
};

module.exports = {
  fetchWallpaperPaths
};