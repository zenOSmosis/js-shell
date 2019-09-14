import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import ChatAppWindow from './ChatAppWindow';
import ChatIcon from 'components/componentIcons/ChatIcon';

export default registerApp({
  title: 'Chat',
  view: (props) => {
    return (
      <ChatAppWindow {...props} />
    );
  },
  iconView: () => <ChatIcon />
});