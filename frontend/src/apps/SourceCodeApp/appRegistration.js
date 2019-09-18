import { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import SourceCodeAppWindow from './SourceCodeAppWindow';
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
  FILE_CHOOSER_MODE_SAVE,
  FILE_CHOOSER_MODE_SAVE_AS
} from 'utils/desktop/launchFileChooserDialog';
import BlueprintIcon from 'components/componentIcons/BlueprintIcon';
// import { setItem } from 'utils/encryptedLocalStorage';

export default registerApp({
  title: 'Source Code',
  view: (props) => {
    return (
      <SourceCodeAppWindow {...props} />
    );
  },
  allowMultipleWindows: true,
  iconView: () =>  <BlueprintIcon />,
  
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
            const { editorLinkedState } = appRuntime.getState();

            openNewAppFile(editorLinkedState);
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
              const { editorLinkedState } = appRuntime.getState();

              const activeAppFilePath = getActiveAppFilePath(editorLinkedState);

              if (activeAppFilePath) {
                await saveAppFile(editorLinkedState, activeAppFilePath);
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
            const { editorLinkedState } = appRuntime.getState();

            const activeAppFilePath = getActiveAppFilePath(editorLinkedState);

            launchFileChooserDialog(appRuntime, FILE_CHOOSER_MODE_SAVE_AS, activeAppFilePath);
          }
        },
        {
          title: 'Close File',
          onClick: (evt, appRuntime) => {
            const { editorLinkedState } = appRuntime.getState();

            const activeAppFile = getActiveAppFile(editorLinkedState);

            if (activeAppFile) {
              closeAppFile(editorLinkedState, activeAppFile);
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
    // TODO: Set __editorLinkedState as appRuntime state; don't create an additional property
    let editorLinkedState = new UniqueSourceCodeAppLinkedState();

    // Creates an untitled file if no new file has been set to open, in the timeout time
    const defaultUntitledFileTimeout = setTimeout(() => {
      const activeAppFile = getActiveAppFile(editorLinkedState);
      
      if (!activeAppFile) {
        openNewAppFile(editorLinkedState);
      }
    }, 50);

    /*
    // TODO: Implement ability to cache non-saved items for later.
    // When a new editor opens, and it's the only editor window, open "unsaved"
    // items in new tabs. If these tabs are then closed without saving, or are
    // saved delete the entries from here.
    editorLinkedState.on('update', (updatedState) => {
      const { activeAppFile } = updatedState;

      if (activeAppFile !== undefined) {
        setItem('protoFile', activeAppFile.fileContent);
      }
    });
    */

    appRuntime.on(EVT_BEFORE_EXIT, () => {
      // Remove the untitled file timeout, if it hasn't run yet
      clearTimeout(defaultUntitledFileTimeout);

      editorLinkedState.destroy();
      editorLinkedState = null;
    });

    appRuntime.setState({
      editorLinkedState
    });
  },

  onExternalFileOpenRequest: async (appRuntime, filePath) => {
    try {
      const { editorLinkedState } = appRuntime.getState();

      await openAppFile(editorLinkedState, filePath);
    } catch (exc) {
      throw exc;
    }
  }
});