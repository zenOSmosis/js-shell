import React from 'react';
import DesktopAppConfig from 'utils/desktop/DesktopAppConfig';
import SettingsWindow from './SettingsWindow';
import config from 'config';

export default new DesktopAppConfig({
  title: 'Settings & Utilities',
  mainWindow: <SettingsWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}settings/settings.svg`
});