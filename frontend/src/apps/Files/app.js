import React from 'react';
import createApp from 'utils/desktop/createApp';
import FilesWindow from './FilesWindow';
import config from 'config';

export default createApp({
  allowMultipleWindows: true,
  title: 'Files',
  mainWindow: <FilesWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}folder/folder.svg`
});