import React from 'react';
import AppConfig from 'utils/desktop/AppConfig';
import WindowManagerWindow from './WindowManagerWindow';
import config from 'config';

export default new AppConfig({
  title: 'Window Manager',
  mainWindow: <WindowManagerWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}windows/windows.svg`
});