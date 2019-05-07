import React from 'react';
import AppConfig from 'utils/desktop/AppConfig';
import HelloWorldWindow from './HelloWorldWindow';
import config from 'config';

export default new AppConfig({
  title: 'Hello World',
  mainWindow: <HelloWorldWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}hello/hello.svg`
});