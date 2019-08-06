import React from 'react';
import ReactPlayer from 'react-player';
import './ReactPlayer.css';

const ResponsiveReactPlayer = (props = {}) => {
  const { className, url, ...propsRest } = props;

  return (
    <div className={`zd-react-player-wrapper ${className ? className : ''}`}>
      <ReactPlayer
        {...propsRest}
        className='zd-react-player'
        url={url}
        width="100%"
        height="100%"
      />
    </div>
  )
};

export default ResponsiveReactPlayer;