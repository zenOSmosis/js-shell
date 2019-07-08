import React from 'react';
import createApp from 'utils/desktop/createApp';
import ProcessTesterWindow from './ProcessTesterWindow';
import config from 'config';

export default createApp({
  title: 'Process Tester',
  mainWindow: <ProcessTesterWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}testing/testing.svg`
});