import React from 'react';
import DesktopAppConfig from 'utils/desktop/DesktopAppConfig';
import DocsWindow from './DocsWindow';
import config from 'config';

export default new DesktopAppConfig({
  title: 'Docs',
  mainWindow: <DocsWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}documentation/documentation.svg`
});