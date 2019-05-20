import React from 'react';
import createApp from 'utils/desktop/createApp';
import DocsWindow from './DocsWindow';
import config from 'config';

export default createApp({
  title: 'Docs',
  mainWindow: <DocsWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}documentation/documentation.svg`
});