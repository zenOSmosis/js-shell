import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import MediaPlayerWindow from './MediaPlayerWindow';
import MediaIcon from 'components/componentIcons/MediaIcon';

export default registerApp({
  title: 'Media Player',
  view: (props) => {
    return (
      <MediaPlayerWindow {...props} />
    )
  },
  // allowMultipleWindows: true,
  // mimeTypes: ['audio/mpeg', 'video/mp4'],
  iconView: () => <MediaIcon />,
  
  // menuItems: [{title: 'play', onClick:()=>{alert('play clicked')}}]
});