import React from 'react';
import MediaPlayerLinkedState from '../../MediaPlayerLinkedState';
import hocConnect from 'state/hocConnect';

// TODO: Rename to TimeRemaining
const NowPlayingHeaderApplet = (props) => {
  const { title, /* thumbnail */ } = props;
  
  return (
    <span style={{fontStyle: 'italic'}}>
        {title}
    </span>
  );
};

const ConnectedNowPlayingHeaderApplet = hocConnect(NowPlayingHeaderApplet, MediaPlayerLinkedState, (updatedState) => {
  const { title, thumbnail } = updatedState;

  const filteredState = {};

  if (title !== undefined) {
    filteredState.title = title;
  }

  if (thumbnail !== undefined) {
    filteredState.thumbnail = thumbnail;
  }

  return filteredState;
});

export default ConnectedNowPlayingHeaderApplet;