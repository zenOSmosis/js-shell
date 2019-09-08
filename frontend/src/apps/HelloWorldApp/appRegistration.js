import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import HelloWorldWindow from './HelloWorldWindow';
import { HOST_ICON_URL_PREFIX } from 'config';

export default registerApp({
  title: 'Hello World',
  view: (props) => {
    return (
      <HelloWorldWindow {...props} />
    );
  },
  iconSrc: `${HOST_ICON_URL_PREFIX}hello/hello.svg`
});