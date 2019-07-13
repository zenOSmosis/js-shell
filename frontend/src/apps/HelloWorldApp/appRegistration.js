import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import HelloWorldWindow from './HelloWorldWindow';
import config from 'config';

export default registerApp({
  title: 'Hello World',
  mainWindow: (props) => {
    return (
      <HelloWorldWindow />
    )
  },
  iconSrc: `${config.HOST_ICON_URI_PREFIX}hello/hello.svg`
});