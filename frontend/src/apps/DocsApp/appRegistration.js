import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import DocsWindow from './DocsWindow';
import { HOST_ICON_URL_PREFIX } from 'config';

export default registerApp({
  title: 'Docs',
  view: (props) => {
    return (
      <DocsWindow {...props} />
    );
  },
  iconSrc: `${HOST_ICON_URL_PREFIX}documentation/documentation.svg`
});