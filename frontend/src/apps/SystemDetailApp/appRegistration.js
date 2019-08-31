import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import SystemDetailWindow from './SystemDetailWindow';
import config from 'config';

export default registerApp({
  title: 'System Detail',
  view: (props) => {
    return (
      <SystemDetailWindow {...props} />
    );
  },
  iconSrc: `${config.HOST_ICON_URL_PREFIX}system/system.svg`
});