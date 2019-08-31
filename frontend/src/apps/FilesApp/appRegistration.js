import React from 'react';
import registerApp from 'utils/desktop/registerApp';
// import FileManager from './FilesWindow';
import ProtoWindow from './_Proto_Window';
import config from 'config';

export default registerApp({
  allowMultipleWindows: true,
  title: 'Files',
  view: (props) => {
    return (
      <ProtoWindow {...props} />
    );
  },
  iconSrc: `${config.HOST_ICON_URL_PREFIX}folder/folder.svg`
});