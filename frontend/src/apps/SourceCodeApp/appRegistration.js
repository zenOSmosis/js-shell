import { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import SourceCodeAppWindow from './SourceCodeAppWindow';
import config from 'config';
import UniqueSourceCodeAppLinkedState from './state/UniqueSourceCodeAppLinkedState';
import openFile from './utils/file/openFile';
import openNewFile from './utils/file/openNewFile';
import saveFile from './utils/file/saveFile';
import launchFileChooserDialog, {
  FILE_CHOOSER_MODE_OPEN,
  // FILE_CHOOSER_MODE_SAVE,
  FILE_CHOOSER_MODE_SAVE_AS
} from 'utils/desktop/launchFileChooserDialog';
import getActiveFilePath from './utils/file/getActiveFilePath';

export default registerApp({
  title: 'Source Code',
  view: (props) => {
    return (
      <SourceCodeAppWindow {...props} />
    );
  },
  allowMultipleWindows: true,
  iconSrc: `${config.HOST_ICON_URL_PREFIX}blueprint/blueprint.svg`,
  
  // TODO: Filter list specific to this app (don't use wildcard)
  mimeTypes: ['*'],
  
  menus: [
    {
      title: 'File',
      items: [
        {
          title: 'New File',
          onClick: (evt, appRuntime) => {
            openNewFile(appRuntime.editorLinkedState);
          }
        },
        {
          title: 'Open',
          onClick: (evt, appRuntime) => {
            launchFileChooserDialog(appRuntime, FILE_CHOOSER_MODE_OPEN);
          }
        },
        {
          title: 'Save',
          onClick: async (evt, appRuntime) => {
            try {
              const activeFilePath = getActiveFilePath(appRuntime.editorLinkedState);

              if (activeFilePath) {
                await saveFile(appRuntime.editorLinkedState, activeFilePath);
              } else {
                launchFileChooserDialog(appRuntime, FILE_CHOOSER_MODE_SAVE);
              }
            } catch (exc) {
              throw exc;
            }
          }
        },
        {
          title: 'Save As',
          onClick: (evt, appRuntime) => {
            const activeFilePath = getActiveFilePath(appRuntime.editorLinkedState);

            launchFileChooserDialog(appRuntime, FILE_CHOOSER_MODE_SAVE_AS, activeFilePath);
          }
        }
        // TODO: Remove; debugging; This should clear the menubar
        /*
        {
          title: 'Proto Clear',
          onClick: (evt, appRuntime) => {
            // TODO: Rename to app.setMenus()
            app.setMenubarData([]);
          }
        }
        */
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

  onExternalFileOpenRequest: async (appRuntime, filePath) => {
    try {
      await openFile(appRuntime.editorLinkedState, filePath);
    } catch (exc) {
      throw exc;
    }
  }
});