import React from 'react';
import AppConfig from 'utils/desktop/AppConfig';
import DocsWindow from './DocsWindow';
import config from 'config';

export default new AppConfig({
  title: 'Docs',
  mainWindow: <DocsWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}documentation/documentation.svg`
});