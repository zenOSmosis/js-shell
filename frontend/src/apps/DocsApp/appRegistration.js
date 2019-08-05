import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import DocsWindow from './DocsWindow';
import config from 'config';

export default registerApp({
  title: 'Docs',
  mainView: (props) => {
    return (
      <DocsWindow {...props} />
    );
  },
  iconSrc: `${config.HOST_ICON_URI_PREFIX}documentation/documentation.svg`
});