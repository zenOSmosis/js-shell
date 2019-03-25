const {fetchFreedesktopApps} = require('../utils/freedesktop/appUtils');

(async () => {
  try {
    const appList = await fetchFreedesktopApps();

    console.log(appList);
  } catch (exc) {
    throw exc;
  }
})();