import React from 'react';
import DesktopAppRunConfig from '../../components/Desktop/DesktopAppRunConfig';
import ScreenRecorderWindow from './ScreenRecorderWindow';
import config from '../../config';

export default new DesktopAppRunConfig({
  title: 'Screen Recorder',
  mainWindow: <ScreenRecorderWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}record/record.svg`
});