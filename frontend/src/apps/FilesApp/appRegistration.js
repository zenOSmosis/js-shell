import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import FilesWindow from './FilesWindow';
import config from 'config';

export default registerApp({
  allowMultipleWindows: true,
  title: 'Files',
  mainView: (props) => {
    return (
      <FilesWindow {...props} />
    );
  },
  iconSrc: `${config.HOST_ICON_URI_PREFIX}folder/folder.svg`
});