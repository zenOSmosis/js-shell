import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import P2PConnectionsWindow from './P2PConnectionsWindow';
import ChatIcon from 'components/componentIcons/ChatIcon';

export default registerApp({
  title: 'P2P Connections',
  view: (props) => {
    return (
      <P2PConnectionsWindow {...props} />
    );
  },
  iconView: () => <ChatIcon />
});