import React from 'react';
import MediaPlayerLinkedState from '../MediaPlayerLinkedState';
import hocConnect from 'state/hocConnect';
import secondsToHHMMSS from 'utils/time/secondsToHHMMSS';

// TODO: Rename to TimeRemaining
const Duration = (props) => {
  const { timeRemaining } = props;
  
  return (
    <span>{timeRemaining ? secondsToHHMMSS(timeRemaining) : '(Length Unknown)'}</span>
  );
};

const ConnectedDuration = hocConnect(Duration, MediaPlayerLinkedState, (updatedState) => {
  const { /* duration,*/ timeRemaining } = updatedState;

  const filteredState = {};

  if (timeRemaining !== undefined) {
    filteredState.timeRemaining = timeRemaining;
  }

  return filteredState;
});

export default ConnectedDuration;