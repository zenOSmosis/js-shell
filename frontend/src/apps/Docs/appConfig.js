import React from 'react';
import DesktopAppRunConfig from '../../utils/DesktopAppRunConfig';
import DocsWindow from './DocsWindow';
import config from '../../config';

export default new DesktopAppRunConfig({
  title: 'Docs',
  mainWindow: <DocsWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}documentation/documentation.svg`
});