import React from 'react';
import DesktopAppRunConfig from '../../utils/DesktopAppRunConfig';
import SettingsWindow from './SettingsWindow';
import config from '../../config';

export default new DesktopAppRunConfig({
  title: 'Settings & Utilities',
  mainWindow: <SettingsWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}settings/settings.svg`
});