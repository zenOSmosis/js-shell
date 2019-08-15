// import React from 'react';
import VoiceInputLinkedState from '../VoiceInputLinkedState';
import hocConnect from 'state/hocConnect';
import AnalogVUMeter from 'components/AnalogVUMeter';

const ConnectedAnalogVUMeter = hocConnect(AnalogVUMeter, VoiceInputLinkedState, (updatedState) => {
  const { micAudioLevelRMS: vuLevel } = updatedState;

  if (vuLevel !== undefined) {
    return {
      vuLevel
    };
  }
});

export default ConnectedAnalogVUMeter;