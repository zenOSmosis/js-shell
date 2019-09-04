import { ACTIVE_APP_FILE, OPENED_APP_FILES } from '../../state/UniqueSourceCodeAppLinkedState';

/**
 * @param {UniqueSourceCodeAppLinkedState} editorLinkedState 
 * @param {AppFile} appFile 
 */
const closeAppFile = async (editorLinkedState, appFile) => {
  try {
    let { [OPENED_APP_FILES]: openedAppFiles, [ACTIVE_APP_FILE]: activeAppFile } = editorLinkedState.getState();

    if (Object.is(activeAppFile, appFile)) {
      // TODO: Set active file to next index...
      activeAppFile = null;
    }

    // Remove the file from the stack
    for (let i = 0; i < openedAppFiles.length; i++) {
      if (Object.is(appFile, openedAppFiles[i])) {
        openedAppFiles.splice(i, 1);    
      }
    }

    editorLinkedState.setState({
      [ACTIVE_APP_FILE]: activeAppFile,
      [OPENED_APP_FILES]: openedAppFiles
    });

  } catch (exc) {
    throw exc;
  }
};

export default closeAppFile;