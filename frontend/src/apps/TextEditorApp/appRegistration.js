import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import TextEditorWindow from './TextEditorWindow';
import config from 'config';

export default registerApp({
  title: 'Text Editor',
  view: (props) => {
    return (
      <TextEditorWindow {...props} />
    )
  },
  iconSrc: `${config.HOST_ICON_URL_PREFIX}text/text.svg`
});