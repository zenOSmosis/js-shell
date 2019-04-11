import React from 'react';
import DesktopAppRunConfig from '../../components/Desktop/DesktopAppRunConfig';
import FileNavigatorWindow from './FileNavigatorWindow';
import config from '../../config';

export default new DesktopAppRunConfig({
  title: 'Files',
  mainWindow: <FileNavigatorWindow />,
  iconSrc: `${config.HOST_ICON_URI_PREFIX}folder/folder.svg`
});