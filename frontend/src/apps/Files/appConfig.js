import React from 'react';
import DesktopAppRunConfig from '../../components/Desktop/DesktopAppRunConfig';
import FilesWindow from './FilesWindow';
import config from '../../config';

export default new DesktopAppRunConfig({
  title: 'Files',
  mainWindow: <FilesWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}folder/folder.svg`
});