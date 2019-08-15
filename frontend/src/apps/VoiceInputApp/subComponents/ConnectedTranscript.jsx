import React from 'react';
import VoiceInputLinkedState from '../VoiceInputLinkedState';
import hocConnect from 'state/hocConnect';

const Transcript = (props) => {
  const { isSTTConnected, transcript } = props;

  return (
    <div>
      {
        !isSTTConnected &&
        <div style={{ fontStyle: 'italic' }}>
          STT is not currently connected.
        </div>
      }
      {
        isSTTConnected &&
        <div>
          Transcript:<br />
          <div style={{ width: '100%', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', textAlign: 'left' }}>
            &nbsp;
            {
              transcript
            }
          </div>
        </div>
      }
    </div>
  );
};

const ConnectedTranscript = hocConnect(Transcript, VoiceInputLinkedState, (updatedState) => {
  const { isSTTConnected, transcript } = updatedState;

  const filteredState = {};

  if (isSTTConnected !== undefined) {
    filteredState.isSTTConnected = isSTTConnected;
  }

  if (transcript !== undefined) {
    filteredState.transcript = transcript;
  }

  return filteredState;
});

export default ConnectedTranscript;