import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import ProcessTesterWindow from './ProcessTesterWindow';
import config from 'config';

export default registerApp({
  title: 'Process Tester',
  mainWindow: <ProcessTesterWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}testing/testing.svg`
});