import React from 'react';
import MediaPlayerLinkedState from '../../MediaPlayerLinkedState';
import { Slider } from 'antd';
import secondsToHHMMSS from 'utils/time/secondsToHHMMSS';
import hocConnect from 'state/hocConnect';

const RangeSlider = (props) => {
  const { playedPercent } = props;

  // console.warn('PLAYED PERCENT', playedPercent);

  return (
    <Slider
      type="range"
      min={0}
      max={100}
      value={playedPercent || 10}
      style={{ width: '100%', verticalAlign: 'middle' }}
      tipFormatter={value => { return secondsToHHMMSS(value); }}
      onChange={evt => { console.warn('TODO: Handle change', evt) }}
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