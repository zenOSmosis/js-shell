import React from 'react';
import DesktopAppConfig from 'utils/desktop/DesktopAppConfig';
import FilesWindow from './FilesWindow';
import config from 'config';

export default new DesktopAppConfig({
  title: 'Files',
  mainWindow: <FilesWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}folder/folder.svg`
});