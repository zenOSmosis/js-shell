import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import ScreenRecorderWindow from './ScreenRecorderWindow';
import config from 'config';

export default registerApp({
  title: 'Screen Recorder',
  view: <ScreenRecorderWindow />,
  iconSrc: `${config.HOST_ICON_URL_PREFIX}record/record.svg`
});