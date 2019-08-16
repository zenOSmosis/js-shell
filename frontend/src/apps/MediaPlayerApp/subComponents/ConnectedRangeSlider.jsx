import React from 'react';
import MediaPlayerLinkedState from '../MediaPlayerLinkedState';
import hocConnect from 'state/hocConnect';

const RangeSlider = (props) => {
  const { playedPercent } = props;

  // console.warn('PLAYED PERCENT', playedPercent);
  
  return (
    <input
      type="range"
      min="0"
      max="100"
      value={ playedPercent || 0 }
      style={{ width: '100%', verticalAlign: 'middle', padding: '4px 20px' }}
      onChange={ evt => { console.warn('TODO: Handle change', evt) }}
    />
  );
};

const ConnectedRangeSlider = hocConnect(RangeSlider, MediaPlayerLinkedState, (updatedState) => {
  const { playedPercent } = updatedState;

  const filteredState = {};

  if (playedPercent !== undefined) {
    filteredState.playedPercent = playedPercent;
  }

  return filteredState;
});

export default ConnectedRangeSlider;