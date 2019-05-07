import React from 'react';
import AppConfig from 'utils/desktop/AppConfig';
import ScreenRecorderWindow from './ScreenRecorderWindow';
import config from 'config';

export default new AppConfig({
  title: 'Screen Recorder',
  mainWindow: <ScreenRecorderWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}record/record.svg`
});