import React from 'react';
import createApp from 'utils/desktop/createApp';
import HelloWorldWindow from './HelloWorldWindow';
import config from 'config';

export default createApp({
  title: 'Hello World',
  mainWindow: <HelloWorldWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}hello/hello.svg`
});