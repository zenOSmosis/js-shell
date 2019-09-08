import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import HelloWorldWindow from './UserProfileWindow';
import { HOST_ICON_URL_PREFIX } from 'config';

export default registerApp({
  title: 'User Profile',
  view: (props) => {
    return (
      <HelloWorldWindow {...props} />
    );
  },
  iconSrc: `${HOST_ICON_URL_PREFIX}avatar/avatar.svg`
});