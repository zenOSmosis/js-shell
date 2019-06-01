import React from 'react';
import createApp from 'utils/desktop/createApp';
import SystemDetailWindow from './SystemDetailWindow';
import config from 'config';

export default createApp({
  title: 'System Detail',
  mainWindow: <SystemDetailWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}system/system.svg`
});