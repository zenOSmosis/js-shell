import React from 'react';
import createApp from 'utils/desktop/createApp';
import AboutWindow from './AboutWindow';
import config from 'config';

export default createApp({
  title: 'About',
  mainWindow: <AboutWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}about-us/about-us.svg`
});