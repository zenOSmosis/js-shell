// const amixerUtils = require('../utils/linux/amixerUtils');

// Troubleshooting
// Linux - No Default Device Found
// Ensure that when you compile portaudio that the configure scripts says "ALSA" yes.
// @see https://github.com/Streampunk/naudiodon#readme
const portAudio = require('naudiodon');

/*
(async () => {
  try {
    const mixerValues = await amixerUtils.fetchMixerValues();

    console.log(JSON.stringify(mixerValues, null, 4));
  } catch (exc) {
    throw exc;
  }
})();
*/

// console.log('devices', portAudio.getDevices());
console.log('host apis', portAudio.getHostAPIs());