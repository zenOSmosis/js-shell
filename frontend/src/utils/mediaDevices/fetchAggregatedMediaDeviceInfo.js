import fetchMediaDevices from './fetchMediaDevices';

/**
 * @typedef {Object} AggregatedMediaDeviceInfo
 * @property {MediaDeviceInfo[]} mediaDevices
 * @property {boolean} hasAudioInput
 * @property {boolean} hasVideoInput
 */

/**
 * @return {AggregatedMediaDeviceInfo}
 */
const fetchAggregatedMediaDeviceInfo = async () => {
  try {
    const mediaDevices = await fetchMediaDevices();

    const kinds = mediaDevices.map(mediaDevice => {
      const { kind } = mediaDevice;

      return kind;
    });

    const hasAudioInput = kinds.includes('audioinput');
    const hasVideoInput = kinds.includes('videoinput');

    return {
      mediaDevices,
      hasAudioInput,
      hasVideoInput
    };
  } catch (exc) {
    throw exc;
  }
};

export default fetchAggregatedMediaDeviceInfo;