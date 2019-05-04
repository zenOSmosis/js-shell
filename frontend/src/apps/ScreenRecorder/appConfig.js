import React from 'react';
import DesktopAppConfig from 'utils/desktop/DesktopAppConfig';
import ScreenRecorderWindow from './ScreenRecorderWindow';
import config from 'config';

export default new DesktopAppConfig({
  title: 'Screen Recorder',
  mainWindow: <ScreenRecorderWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}record/record.svg`
});