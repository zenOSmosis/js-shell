import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import A3DAppMainWindow from './A3DAppMainWindow';
import config from 'config';

export default registerApp({
  title: 'Hello World',
  mainView: (props) => {
    return (
      <A3DAppMainWindow {...props} />
    );
  },
  iconSrc: `${config.HOST_ICON_URL_PREFIX}hello/hello.svg`
});