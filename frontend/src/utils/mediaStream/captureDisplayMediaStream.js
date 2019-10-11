/**
 * @param {Object} constraints?
 * @return {Promise<MediaStream>}
 */
const captureDisplayMediaStream = async (constraints = { audio: false, video: true }) => {
  try {
    const mediaStream = await window.navigator.mediaDevices.getDisplayMedia(constraints);

    return mediaStream;
  } catch (exc) {
    throw exc;
  }
};

export default captureDisplayMediaStream;