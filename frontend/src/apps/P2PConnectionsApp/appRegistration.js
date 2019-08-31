import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import P2PConnectionsWindow from './P2PConnectionsWindow';
import config from 'config';

export default registerApp({
  title: 'P2P Connections',
  view: (props) => {
    return (
      <P2PConnectionsWindow {...props} />
    );
  },
  iconSrc: `${config.HOST_ICON_URL_PREFIX}people-connection/people-connection.svg`
});