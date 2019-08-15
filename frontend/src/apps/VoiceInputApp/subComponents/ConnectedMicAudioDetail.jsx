import React from 'react';
import VoiceInputLinkedState from '../VoiceInputLinkedState';
import hocConnect from 'state/hocConnect';

const MicAudioDetail = (props) => {
  const {
    micSampleDuration,
    micSampleLength,
    micNumberOfChannels,
    micSampleRate,

    micAudioLevelRMS,
    micAudioLevelDB,

    // isAudioWorkerOnline,

    // transcript,

    audioWorkerDownsampleRate,
    // isSTTConnected,

    // STT API connection status
    wsBackendStatus
  } = props;

  return (
    <table>
      <tbody>
        <tr>
          <td>
            STT API connection status
          </td>
          <td>
            {wsBackendStatus}
          </td>
        </tr>

        <tr>
          <td>
            Mic sample duration
          </td>
          <td>
            {
              micSampleDuration &&
              <span>{micSampleDuration} seconds</span>
            }
          </td>
        </tr>

        <tr>
          <td>
            Mic sample length
          </td>
          <td>
            {micSampleLength} bytes
          </td>
        </tr>

        <tr>
          <td>
            Mic sample rate
          </td>
          <td>
            {micSampleRate}
          </td>
        </tr>

        <tr>
          <td>
            Mic channels
          </td>
          <td>
            {micNumberOfChannels}
          </td>
        </tr>
        <tr>
          <td>
            Audio level RMS
          </td>
          <td>
            {micAudioLevelRMS}
          </td>
        </tr>

        <tr>
          <td>
            Audio level DB
          </td>
          <td>
            {
              micAudioLevelDB &&
              <span>{micAudioLevelDB} db</span>
            }
          </td>
        </tr>

        <tr>
          <td>
            Downsample Rate
          </td>
          <td>
            {audioWorkerDownsampleRate}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const ConnectedMicAudioDetail = hocConnect(MicAudioDetail, VoiceInputLinkedState, (updatedState, linkedState) => {
  const state = linkedState.getState();

  return state;
});

export default ConnectedMicAudioDetail;