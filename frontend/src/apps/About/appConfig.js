import React from 'react';
import DesktopAppConfig from 'utils/desktop/DesktopAppConfig';
import AboutWindow from './AboutWindow';
import config from 'config';

export default new DesktopAppConfig({
  title: 'About',
  mainWindow: <AboutWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}about-us/about-us.svg`
});