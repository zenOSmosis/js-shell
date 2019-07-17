const {fetchFreedesktopApps} = require('../src/utils/freedesktop.org/appUtils');

(async () => {
  try {
    const appList = await fetchFreedesktopApps();

    console.log(appList);
  } catch (exc) {
    throw exc;
  }
})();