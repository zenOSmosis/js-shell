import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import WindowManagerWindow from './WindowManagerWindow';
import config from 'config';

export default registerApp({
  title: 'Window Manager',
  view: <WindowManagerWindow />,
  iconView: `${config.HOST_ICON_URL_PREFIX}windows/windows.svg`
});