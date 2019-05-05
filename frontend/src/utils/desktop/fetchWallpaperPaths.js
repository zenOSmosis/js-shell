import socketQuery from '../socketQuery';

const fetchWallpaperPaths = async () => {
  return await socketQuery('wallpapers:fetch-wallpaper-paths');
}

export default fetchWallpaperPaths;