import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import SystemDetailWindow from './SystemDetailWindow';
import config from 'config';

export default registerApp({
  title: 'System Detail',
  mainWindow: <SystemDetailWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}system/system.svg`
});