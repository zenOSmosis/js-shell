import React from 'react';
import createApp from 'utils/desktop/createApp';
import WindowManagerWindow from './WindowManagerWindow';
import config from 'config';

export default createApp({
  title: 'Window Manager',
  mainWindow: <WindowManagerWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}windows/windows.svg`
});