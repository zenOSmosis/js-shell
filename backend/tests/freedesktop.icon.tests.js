const iconUtils = require('../utils/freedesktop.org/iconUtils');

/*
(async () => {
  try {
    const iconPaths = await iconUtils.fetchAllParsedIconPaths();
    console.log(iconPaths);
  } catch (exc) {
    throw exc;
  }
})();
*/

(async () => {
  try {
    // const iconPath = await iconUtils.fetchIconPath('nexuiz');
    // const iconPath = await iconUtils.fetchIconPath('pychess');
    const iconPath = await iconUtils.fetchIconPath('multimedia-volume-control');
    // const iconPath = await iconUtils.fetchIconPath('/opt/Postman/app/resources/app/assets/icon.png');
    console.log(iconPath);
  } catch (exc) {
    throw exc;
  }
})();