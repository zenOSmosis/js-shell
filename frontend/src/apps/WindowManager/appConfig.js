import React from 'react';
import DesktopAppRunConfig from '../../utils/DesktopAppRunConfig';
import WindowManagerWindow from './WindowManagerWindow';
import config from '../../config';

export default new DesktopAppRunConfig({
  title: 'Window Manager',
  mainWindow: <WindowManagerWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}windows/windows.svg`
});