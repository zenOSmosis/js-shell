const {fetchSystemInformation, SYSINFO_MODES} = require('../utils/systemInformation');

(async () => {
  try {
    for (let i = 0; i < SYSINFO_MODES.length; i++) {
      const mode = SYSINFO_MODES[i];
      console.log(`Mode: ${mode}`);
      const info = await fetchSystemInformation(mode);
      console.log(info);
    }
  } catch (exc) {
    console.error('Exception thrown:');
    throw exc;
  }
})();