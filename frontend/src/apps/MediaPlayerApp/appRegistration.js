import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import MediaPlayerWindow from './MediaPlayerWindow';
import config from 'config';

export default registerApp({
  title: 'Media Player',
  mainView: (props) => {
    return (
      <MediaPlayerWindow {...props} />
    )
  },
  // allowMultipleWindows: true,
  // supportedMimes: ['audio/mpeg', 'video/mp4'],
  iconSrc: `${config.HOST_ICON_URI_PREFIX}media/media.svg`,
  menuItems: [{title: 'play', onClick:()=>{alert('play clicked')}}]
});