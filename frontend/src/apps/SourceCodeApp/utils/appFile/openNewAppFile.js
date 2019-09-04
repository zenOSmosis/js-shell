import { OPENED_APP_FILES, ACTIVE_APP_FILE } from '../../state/UniqueSourceCodeAppLinkedState';

/**
 * Opens a new, untitled file.
 * 
 * @param {*} editorLinkedState 
 */
const openNewAppFile = (editorLinkedState) => {
  const { [OPENED_APP_FILES]: openedAppFiles } = editorLinkedState.getState();
  
  openedAppFiles.push({});

  editorLinkedState.setState({
    [OPENED_APP_FILES]: openedAppFiles,
    
    // Set active file to be most recent file
    [ACTIVE_APP_FILE]: openedAppFiles[openedAppFiles.length - 1]
  });
};

export default openNewAppFile;