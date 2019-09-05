import { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import SourceCodeAppWindow from './SourceCodeAppWindow';
import config from 'config';
import UniqueSourceCodeAppLinkedState from './state/UniqueSourceCodeAppLinkedState';
import {
  openAppFile,
  openNewAppFile,
  saveAppFile,
  getActiveAppFile,
  getActiveAppFilePath,
  closeAppFile
} from 'utils/appFile';
import launchFileChooserDialog, {
  FILE_CHOOSER_MODE_OPEN,
  // FILE_CHOOSER_MODE_SAVE,
  FILE_CHOOSER_MODE_SAVE_AS
} from 'utils/desktop/launchFileChooserDialog';

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
  
  // TODO: Create setMenus(appRuntime)
  menus: [
    {
      title: 'File',
      items: [
        {
          title: 'New File',
          onClick: (evt, appRuntime) => {
            openNewAppFile(appRuntime.editorLinkedState);
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
              const activeAppFilePath = getActiveAppFilePath(appRuntime.editorLinkedState);

              if (activeAppFilePath) {
                await saveAppFile(appRuntime.editorLinkedState, activeAppFilePath);
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
            const activeAppFilePath = getActiveAppFilePath(appRuntime.editorLinkedState);

            launchFileChooserDialog(appRuntime, FILE_CHOOSER_MODE_SAVE_AS, activeAppFilePath);
          }
        },
        {
          title: 'Close File',
          onClick: (evt, appRuntime) => {
            const activeAppFile = getActiveAppFile(appRuntime.editorLinkedState);

            if (activeAppFile) {
              closeAppFile(appRuntime.editorLinkedState, activeAppFile);
            }
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
    // TODO: Set editorLinkedState as appRuntime state; don't create an additional property
    appRuntime.editorLinkedState = new UniqueSourceCodeAppLinkedState();

    appRuntime.on(EVT_BEFORE_EXIT, () => {
      appRuntime.editorLinkedState.destroy();
      appRuntime.editorLinkedState = null;
    });
  },

  onExternalFileOpenRequest: async (appRuntime, filePath) => {
    try {
      await openAppFile(appRuntime.editorLinkedState, filePath);
    } catch (exc) {
      throw exc;
    }
  }
});