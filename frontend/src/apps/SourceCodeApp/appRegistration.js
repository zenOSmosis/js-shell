import { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import SourceCodeAppWindow from './SourceCodeAppWindow';
import config from 'config';
import createSourceCodeAppLinkedState from './utils/createSourceCodeAppLinkedState';

export default registerApp({
  title: 'Source Code',
  view: (props) => {
    return (
      <SourceCodeAppWindow {...props} />
    );
  },
  allowMultipleWindows: true,
  iconSrc: `${config.HOST_ICON_URL_PREFIX}blueprint/blueprint.svg`,
  cmd: (app) => {
    app.editorLinkedState = createSourceCodeAppLinkedState();

    app.on(EVT_BEFORE_EXIT, () => {
      app.editorLinkedState.destroy();
      app.editorLinkedState = null;
    });
  }
});