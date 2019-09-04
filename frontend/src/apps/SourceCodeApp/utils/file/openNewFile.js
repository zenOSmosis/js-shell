import { OPENED_FILES, ACTIVE_FILE } from '../../state/UniqueSourceCodeAppLinkedState';

/**
 * Opens a new, untitled file.
 * 
 * @param {*} editorLinkedState 
 */
const openNewFile = (editorLinkedState) => {
  const { [OPENED_FILES]: openedFiles } = editorLinkedState.getState();
  
  openedFiles.push({});

  editorLinkedState.setState({
    [OPENED_FILES]: openedFiles,
    
    // Set active file to be most recent file
    [ACTIVE_FILE]: openedFiles[openedFiles.length - 1]
  });
};

export default openNewFile;