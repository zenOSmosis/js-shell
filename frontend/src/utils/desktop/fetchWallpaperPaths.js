import socketAPIQuery from '../socketAPI/socketAPIQuery';

const fetchWallpaperPaths = async () => {
  return await socketAPIQuery('wallpapers:fetch-wallpaper-paths');
}

export default fetchWallpaperPaths;