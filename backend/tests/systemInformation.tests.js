const {fetchSystemInformation, SYSINFO_MODE_BLOCKDEVICES, SYSINFO_MODE_DISKSIO, SYSINFO_MODE_FSSIZE, SYSINFO_MODE_FSSTATS, SYSINFO_MODES} = require('../utils/systemInformation');

(async () => {
  try {

    console.log('block devices');
    console.log(await (fetchSystemInformation(SYSINFO_MODE_BLOCKDEVICES)));
    
    console.log('disk i/o');
    console.log(await (fetchSystemInformation(SYSINFO_MODE_DISKSIO)));
    
    console.log('fs size');
    console.log(await (fetchSystemInformation(SYSINFO_MODE_FSSIZE)));
    
    console.log('fs stats');
    console.log(await (fetchSystemInformation(SYSINFO_MODE_FSSTATS)));

    /*
    for (let i = 0; i < SYSINFO_MODES.length; i++) {
      const mode = SYSINFO_MODES[i];
      console.log(`Mode: ${mode}`);
      const info = await fetchSystemInformation(mode);
      console.log(info);
    }
    */
  } catch (exc) {
    console.error('Exception thrown:');
    throw exc;
  }
})();