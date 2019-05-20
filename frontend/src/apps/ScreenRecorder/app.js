import React from 'react';
import createApp from 'utils/desktop/createApp';
import ScreenRecorderWindow from './ScreenRecorderWindow';
import config from 'config';

export default createApp({
  title: 'Screen Recorder',
  mainWindow: <ScreenRecorderWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}record/record.svg`
});