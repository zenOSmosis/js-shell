import React from 'react';
import createApp from 'utils/desktop/createApp';
import SettingsWindow from './SettingsWindow';
import config from 'config';

export default createApp({
  title: 'Settings',
  mainWindow: <SettingsWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}settings/settings.svg`
});