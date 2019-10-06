/**
 * Requests a list of the available media input and output devices, such as
 * microphones, cameras, headsets, and so forth.
 * 
 * Note, for security reasons, the label field is always blank unless an active
 * media stream exists or the user has granted persistent permission for media
 * device access. The set of device labels could otherwise be used as part of a
 * fingerprinting mechanism to identify a user.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo 
 * 
 * @return {Promise<MediaDeviceInfo[]>}
 */
const fetchMediaDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();

    return devices;
  } catch (exc) {
    throw exc;
  }
};

export default fetchMediaDevices;