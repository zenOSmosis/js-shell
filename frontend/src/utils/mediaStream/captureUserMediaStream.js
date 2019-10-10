/**
 * @param {Object} constraints?
 * @return {Promise<MediaStream>}
 */
const captureUserMediaStream = async (constraints = {audio: false, video: false}) => {
  try {
    const mediaStream = await window.navigator.mediaDevices.getUserMedia(constraints);

    return mediaStream;
  } catch (exc) {
    throw exc;
  }
};

export default captureUserMediaStream;