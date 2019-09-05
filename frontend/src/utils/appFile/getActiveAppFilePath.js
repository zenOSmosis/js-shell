import { ACTIVE_APP_FILE } from 'state/UniqueMultiAppFileLinkedState';

/**
 * Retrieves the file path of the currently active (or focused) file.
 * 
 * @param {UniqueSourceCodeUniqueMultiAppFileLinkedState} uniqueMultiAppFileLinkedState
 * @return {string} The filePath of the active file.
 */
const getActiveAppFilePath = (uniqueMultiAppFileLinkedState) => {
  const { [ACTIVE_APP_FILE]: activeAppFile } = uniqueMultiAppFileLinkedState.getState();

  if (activeAppFile && activeAppFile.filePath) {
    const { filePath } = activeAppFile;

    return filePath;
  }
};

export default getActiveAppFilePath;