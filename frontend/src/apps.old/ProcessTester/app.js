import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import ProcessTesterWindow from './ProcessTesterWindow';
import config from 'config';

export default registerApp({
  title: 'Process Tester',
  mainView: <ProcessTesterWindow />,
  iconSrc: `${config.HOST_ICON_URL_PREFIX}testing/testing.svg`
});