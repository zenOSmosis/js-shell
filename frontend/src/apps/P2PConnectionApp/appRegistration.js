import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import HelloWorldWindow from './P2PConnectionWindow';
import config from 'config';

export default registerApp({
  title: 'P2P Connections',
  mainView: (props) => {
    return (
      <HelloWorldWindow {...props} />
    )
  },
  iconSrc: `${config.HOST_ICON_URI_PREFIX}people-connection/people-connection.svg`
});