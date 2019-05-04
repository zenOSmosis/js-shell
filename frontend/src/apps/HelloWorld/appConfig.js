import React from 'react';
import DesktopAppConfig from 'utils/desktop/DesktopAppConfig';
import HelloWorldWindow from './HelloWorldWindow';
import config from 'config';

export default new DesktopAppConfig({
  title: 'Hello World',
  mainWindow: <HelloWorldWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}hello/hello.svg`
});