import React from 'react';
import DesktopAppRunConfig from 'utils/DesktopAppRunConfig';
import AboutWindow from './AboutWindow';
import config from 'config';

export default new DesktopAppRunConfig({
  title: 'About',
  mainWindow: <AboutWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}about-us/about-us.svg`
});