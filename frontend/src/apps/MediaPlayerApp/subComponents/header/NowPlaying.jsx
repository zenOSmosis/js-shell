import React from 'react';
import MediaPlayerLinkedState from '../../MediaPlayerLinkedState';
import hocConnect from 'state/hocConnect';

// TODO: Rename to TimeRemaining
const NowPlayingHeaderApplet = (props) => {
  const { title, isLoading } = props;
  
  return (
    <span style={{fontStyle: 'italic'}}>
        {isLoading ? 'Loading' : ''}
        {title}
    </span>
  );
};

const ConnectedNowPlayingHeaderApplet = hocConnect(NowPlayingHeaderApplet, MediaPlayerLinkedState, (updatedState) => {
  const { title, thumbnail, isLoading } = updatedState;

  const filteredState = {};

  if (title !== undefined) {
    filteredState.title = title;
  }

  if (thumbnail !== undefined) {
    filteredState.thumbnail = thumbnail;
  }

  if (isLoading !== undefined) {
    filteredState.isLoading = isLoading;
  }

  return filteredState;
});

export default ConnectedNowPlayingHeaderApplet;