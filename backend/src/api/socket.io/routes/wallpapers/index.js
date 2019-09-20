const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');
const {fetchWallpaperPaths: doFetchWallpaperPaths} = require('utils/freedesktop.org/wallpapers');

const fetchWallpaperPaths = async (options = {}, ack) => {
  return await handleSocketAPIRoute(async (options) => {
    try {
      const wallpaperPaths = await doFetchWallpaperPaths();
  
      return wallpaperPaths;
    } catch (exc) {
      throw exc;
    }
  }, ack);
};

module.exports = {
  fetchWallpaperPaths
};