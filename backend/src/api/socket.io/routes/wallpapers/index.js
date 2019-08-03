const handleSocketAPIRoute = require('utils/socketAPI/handleSocketAPIRoute');
const {fetchWallpaperPaths: doFetchWallpaperPaths} = require('utils/freedesktop.org/wallpapers');

const fetchWallpaperPaths = async (options = {}, ack) => {
  return await handleSocketAPIRoute(async (options) => {
    try {
      console.log('..');
      const wallpaperPaths = await doFetchWallpaperPaths();
  
      return ack(wallpaperPaths);
    } catch (exc) {
      throw exc;
    }
  }, ack);
};

module.exports = {
  fetchWallpaperPaths
};