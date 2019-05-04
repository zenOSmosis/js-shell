import React from 'react';
import DesktopAppConfig from 'utils/desktop/DesktopAppConfig';
import WindowManagerWindow from './WindowManagerWindow';
import config from 'config';

export default new DesktopAppConfig({
  title: 'Window Manager',
  mainWindow: <WindowManagerWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}windows/windows.svg`
});