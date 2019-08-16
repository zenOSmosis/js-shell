import React from 'react';
import MediaPlayerLinkedState from '../../MediaPlayerLinkedState';
import hocConnect from 'state/hocConnect';
import secondsToHHMMSS from 'utils/time/secondsToHHMMSS';

const TimeRemaining = (props) => {
  const { timeRemaining } = props;
  
  return (
    <span>{timeRemaining ? secondsToHHMMSS(timeRemaining) : ''}</span>
  );
};

const ConnectedTimeRemaining = hocConnect(TimeRemaining, MediaPlayerLinkedState, (updatedState) => {
  const { /* duration,*/ timeRemaining } = updatedState;

  const filteredState = {};

  if (timeRemaining !== undefined) {
    filteredState.timeRemaining = timeRemaining;
  }

  return filteredState;
});

export default ConnectedTimeRemaining;