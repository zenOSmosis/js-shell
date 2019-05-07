import React from 'react';
import AppConfig from 'utils/desktop/AppConfig';
import FilesWindow from './FilesWindow';
import config from 'config';

export default new AppConfig({
  title: 'Files',
  mainWindow: <FilesWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}folder/folder.svg`
});