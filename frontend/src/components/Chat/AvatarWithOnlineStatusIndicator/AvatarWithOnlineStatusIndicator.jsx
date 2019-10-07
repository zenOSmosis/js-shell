import React from 'react';
import { Avatar } from 'antd';
import classNames from 'classnames';
import styles from './AvatarWithOnlineStatusIndicator.module.scss';
import PropTypes from 'prop-types';

const AvatarWithOnlineStatusIndicator = (props) => {
  const { className, isOnline, size = 40 } = props;

  const onlineStatusIndicatorSize = Math.floor(size / 3.33);

  return (
    <div
      className={classNames(styles['avatar-with-online-indicator'], className)}
      style={{ width: size, height: size }}
    >
      <Avatar
        size={size}
        icon="user" // TODO: Include provisioning for icon src
      />
      {
        typeof isOnline !== 'undefined' &&
        <div
          style={{
            width: onlineStatusIndicatorSize,
            height: onlineStatusIndicatorSize,
            borderRadius: onlineStatusIndicatorSize,
          }}
          className={classNames(styles['online-indicator'], isOnline ? styles['online'] : styles['offline'])}
        ></div>
      }
    </div>
  );
};

AvatarWithOnlineStatusIndicator.propTypes = {
  className: PropTypes.string,
  isOnline: PropTypes.bool,
  size: PropTypes.number
}

export default AvatarWithOnlineStatusIndicator;