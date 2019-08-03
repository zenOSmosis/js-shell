import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import HelloWorldWindow from './UserProfileWindow';
import config from 'config';

export default registerApp({
  title: 'User Profile',
  mainView: (props) => {
    return (
      <HelloWorldWindow {...props} />
    );
  },
  iconSrc: `${config.HOST_ICON_URI_PREFIX}avatar/avatar.svg`
});