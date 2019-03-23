const {fetchFreedesktopAppList} = require('../utils/freedesktop/appUtils');

(async () => {
  try {
    const appList = await fetchFreedesktopAppList();

    console.log(appList);
  } catch (exc) {
    throw exc;
  }
})();