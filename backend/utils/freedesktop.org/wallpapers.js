const config = require('../../config');
const fetchRecursiveFilePaths = require('../../utils/fileSystem/fetchRecursiveFilePaths');

const fetchWallpaperPaths = async (readDirectories = config.WALLPAPER_LOCATIONS) => {
  try {
    const wallpaperPaths = [];

    for (let i = 0; i < readDirectories.length; i++) {
      const dir = readDirectories[i];
  
      const dirPaths = await fetchRecursiveFilePaths(dir, config.WALLPAPER_FILE_EXTENSIONS);
  
      dirPaths.forEach((dirPath) => {
        wallpaperPaths.push(dirPath);
      });
    }

    return wallpaperPaths;
  } catch (exc) {
    throw exc;
  }
};

module.exports = {
  fetchWallpaperPaths
};