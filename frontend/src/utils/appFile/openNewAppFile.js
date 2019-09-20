import { OPENED_APP_FILES, ACTIVE_APP_FILE } from 'state/UniqueMultiAppFileLinkedState';
import createAppFile from './_createAppFile';

/**
 * Opens a new, untitled file.
 * 
 * @param {UniqueMultiAppFileLinkedState} uniqueMultiAppFileLinkedState
 */
const openNewAppFile = (uniqueMultiAppFileLinkedState) => {
  const { [OPENED_APP_FILES]: openedAppFiles } = uniqueMultiAppFileLinkedState.getState();
  
  openedAppFiles.push(createAppFile());

  uniqueMultiAppFileLinkedState.setState({
    [OPENED_APP_FILES]: openedAppFiles,
    
    // Set active file to be most recent file
    [ACTIVE_APP_FILE]: openedAppFiles[openedAppFiles.length - 1]
  });
};

export default openNewAppFile;