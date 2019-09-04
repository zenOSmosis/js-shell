import { ACTIVE_APP_FILE } from '../../state/UniqueSourceCodeAppLinkedState';

/**
 * Retrieves the file path of the currently active (or focused) file.
 * 
 * @param {UniqueSourceCodeEditorLinkedState} editorLinkedState
 * @return {string} The filePath of the active file.
 */
const getActiveAppFilePath = (editorLinkedState) => {
  const { [ACTIVE_APP_FILE]: activeAppFile } = editorLinkedState.getState();

  if (activeAppFile && activeAppFile.filePath) {
    const { filePath } = activeAppFile;

    return filePath;
  }
};

export default getActiveAppFilePath;