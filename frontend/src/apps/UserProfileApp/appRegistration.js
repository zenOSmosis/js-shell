import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import UserProfileWindow from './UserProfileWindow';
import AvatarIcon from 'components/componentIcons/AvatarIcon';

export default registerApp({
  title: 'User Profile',
  view: (props) => {
    return (
      <UserProfileWindow {...props} />
    );
  },
  iconView: () => <AvatarIcon />
});