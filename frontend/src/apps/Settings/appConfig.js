import React from 'react';
import AppConfig from 'utils/desktop/AppConfig';
import SettingsWindow from './SettingsWindow';
import config from 'config';

export default new AppConfig({
  title: 'Settings & Utilities',
  mainWindow: <SettingsWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}settings/settings.svg`
});