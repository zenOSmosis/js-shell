import { ACTIVE_APP_FILE, OPENED_APP_FILES } from 'state/UniqueMultiAppFileLinkedState';

/**
 * Closes, and removes the given AppFile.
 * 
 * @param {UniqueMultiAppFileLinkedState} uniqueMultiAppFileLinkedState 
 * @param {AppFile} appFile 
 */
const closeAppFile = async (uniqueMultiAppFileLinkedState, appFile) => {
  try {
    let {
      [OPENED_APP_FILES]: openedAppFiles,
      [ACTIVE_APP_FILE]: activeAppFile
    } = uniqueMultiAppFileLinkedState.getState();

    if (Object.is(activeAppFile, appFile)) {
      activeAppFile = null;
    }

    // Remove the file from the stack
    for (let i = 0; i < openedAppFiles.length; i++) {
      if (Object.is(appFile, openedAppFiles[i])) {
        openedAppFiles.splice(i, 1);

        // Handle setting another activeAppFile if it's not currently available
        if (!activeAppFile) {
          if (openedAppFiles[i + 1]) {
            activeAppFile = openedAppFiles[i + 1];
          } else if (openedAppFiles[i - 1]) {
            activeAppFile = openedAppFiles[i - 1];
          }
        }

        break;
      }
    }

    uniqueMultiAppFileLinkedState.setState({
      [ACTIVE_APP_FILE]: activeAppFile,
      [OPENED_APP_FILES]: openedAppFiles
    });

  } catch (exc) {
    throw exc;
  }
};

export default closeAppFile;