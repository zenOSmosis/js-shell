/**
 * @param {Object} constraints?
 * @return {Promise<MediaStream>}
 */
const captureUserMediaStream = async (constraints = { audio: true, video: true }) => {
  try {
    const mediaStream = await window.navigator.mediaDevices.getUserMedia(constraints);

    return mediaStream;
  } catch (exc) {
    throw exc;
  }
};

export default captureUserMediaStream;