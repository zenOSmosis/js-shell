import { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import SourceCodeAppWindow from './SourceCodeAppWindow';
import config from 'config';
import UniqueSourceCodeAppLinkedState from './state/UniqueSourceCodeAppLinkedState';
import openFile from './utils/file/openFile';

export default registerApp({
  title: 'Source Code',
  view: (props) => {
    return (
      <SourceCodeAppWindow {...props} />
    );
  },
  allowMultipleWindows: true,
  iconSrc: `${config.HOST_ICON_URL_PREFIX}blueprint/blueprint.svg`,
  mimeTypes: ['*'],
  menus: [
    {
      title: 'File',
      items: [
        {
          title: 'Open File',
          onClick: (evt, appRuntime) => {
            alert('TODO: This should bring up the file picker!');
          }
        },
        // TODO: Remove; debugging; This should clear the menubar
        {
          title: 'Proto Clear',
          onClick: (evt, appRuntime) => {
            // TODO: Rename to app.setMenus()
            app.setMenubarData([]);
          }
        }
      ]
    }
  ],
  
  cmd: (appRuntime) => {
    appRuntime.editorLinkedState = new UniqueSourceCodeAppLinkedState();

    appRuntime.on(EVT_BEFORE_EXIT, () => {
      appRuntime.editorLinkedState.destroy();
      appRuntime.editorLinkedState = null;
    });
  },

  onFileOpenRequest: async (appRuntime, filePath) => {
    try {
      await openFile(appRuntime.editorLinkedState, filePath);
    } catch (exc) {
      throw exc;
    }
  }
});