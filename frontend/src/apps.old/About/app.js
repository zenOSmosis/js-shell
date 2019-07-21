import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import AboutWindow from './AboutWindow';
import config from 'config';

export default registerApp({
  title: 'About',
  mainView: <AboutWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}about-us/about-us.svg`
});