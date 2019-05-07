import React from 'react';
import AppConfig from 'utils/desktop/AppConfig';
import AboutWindow from './AboutWindow';
import config from 'config';

export default new AppConfig({
  title: 'About',
  mainWindow: <AboutWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}about-us/about-us.svg`
});