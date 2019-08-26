import { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import AppBlueprintBaseWindow from './SourceCodeAppWindow';
import LinkedState from 'state/LinkedState';
import config from 'config';
import uuidv4 from 'uuidv4';

export default registerApp({
  title: 'Source Code',
  mainView: (props) => {
    return (
      <AppBlueprintBaseWindow {...props} />
    );
  },
  allowMultipleWindows: true,
  iconSrc: `${config.HOST_ICON_URL_PREFIX}blueprint/blueprint.svg`,
  cmd: (app) => {
    app.editorLinkedState = new LinkedState(`editor-${uuidv4()}`, {
      requestOpenPaths: [],

      cursorPosition: {
        endColumn: 0,
        endLineNumber: 0,
        positionColumn: 0,
        positionLineNumber: 0,
        selectionStartColumn: 0,
        selectionStartLineNumber: 0,
        startColumn: 0,
        startLineNumber: 0
      }
    });

    app.on(EVT_BEFORE_EXIT, () => {
      app.editorLinkedState.destroy();
      app.editorLinkedState = null;
    });
  }
});