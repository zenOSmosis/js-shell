const { socketAPIQuery } = this.utils;

(async () => {
  try {
    const nodeUptime = await socketAPIQuery('api/fetch-node-uptime');

    console.log(nodeUptime);
  } catch (exc) {
    throw exc;
  }
})();