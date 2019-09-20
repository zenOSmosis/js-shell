import React from 'react';
import MediaPlayerLinkedState from '../../MediaPlayerLinkedState';
import hocConnect from 'state/hocConnect';
import secondsToHHMMSS from 'utils/time/secondsToHHMMSS';

const TimeRemaining = (props) => {
  const { timeRemaining: propsTimeRemaining, ...propsRest } = props;
  const timeRemaining = propsTimeRemaining | 0;
  
  return (
    <span {...propsRest}>{secondsToHHMMSS(timeRemaining)}</span>
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