import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import ProcessTesterWindow from './ProcessTesterWindow';
import config from 'config';

export default registerApp({
  title: 'Process Tester',
  view: <ProcessTesterWindow />,
  iconView: `${config.HOST_ICON_URL_PREFIX}testing/testing.svg`
});