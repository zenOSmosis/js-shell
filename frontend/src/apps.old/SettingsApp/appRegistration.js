import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import SettingsWindow from './SettingsWindow';
import { HOST_ICON_URL_PREFIX } from 'config';

export default registerApp({
  title: 'Settings',
  view: (props) => {
    return (
      <SettingsWindow {...props} />
    )
  },
  iconView: `${HOST_ICON_URL_PREFIX}settings/settings.svg`
});
