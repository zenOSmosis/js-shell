import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import P2PConnectionsWindow from './P2PConnectionsWindow';
import config from 'config';

export default registerApp({
  title: 'P2P Connections',
  mainView: (props) => {
    return (
      <P2PConnectionsWindow {...props} />
    );
  },
  iconSrc: `${config.HOST_ICON_URI_PREFIX}people-connection/people-connection.svg`
});