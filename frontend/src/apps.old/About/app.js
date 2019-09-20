import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import AboutWindow from './AboutWindow';
import config from 'config';

export default registerApp({
  title: 'About',
  view: <AboutWindow />,
  iconView: `${config.HOST_ICON_URL_PREFIX}about-us/about-us.svg`
});