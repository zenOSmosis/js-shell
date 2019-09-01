import React from 'react';
import registerApp from 'utils/desktop/registerApp';
// import FileManager from './FilesWindow';
import SocketFSFilePickerWindow from 'components/SocketFSFilePickerWindow';
import config from 'config';

export default registerApp({
  allowMultipleWindows: true,
  title: 'Files',
  view: (props) => {
    return (
      <SocketFSFilePickerWindow {...props} />
    );
  },
  iconSrc: `${config.HOST_ICON_URL_PREFIX}folder/folder.svg`
});