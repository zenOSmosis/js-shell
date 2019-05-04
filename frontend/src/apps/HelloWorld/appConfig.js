import React from 'react';
import DesktopAppRunConfig from '../../utils/DesktopAppRunConfig';
import HelloWorldWindow from './HelloWorldWindow';
import config from '../../config';

export default new DesktopAppRunConfig({
  title: 'Hello World',
  mainWindow: <HelloWorldWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}hello/hello.svg`
});