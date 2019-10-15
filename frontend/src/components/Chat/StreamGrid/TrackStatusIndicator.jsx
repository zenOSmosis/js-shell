import React from 'react';
import classNames from 'classnames';
import styles from './StreamGrid.module.scss';

const TrackStatusIndicator = (props) => {
  const { mediaStreamTrack, ...propsRest } = props;

  const isActive = mediaStreamTrack.readyState === 'live';

  return (
    <div
      {...propsRest}
      className={
        classNames(
          styles['track-status-indicator'],
          isActive ? styles['active'] : null
        )
      }
    ></div>
  );
};

export default TrackStatusIndicator;