import { OPENED_APP_FILES } from 'state/UniqueMultiAppFileLinkedState';

/**
 * Retrieves the AppFile with the given filePath.
 * 
 * @param {SourceCodeAppLinkedState} uniqueMultiAppFileLinkedState 
 * @param {string} filePath
 * @return {AppFile}
 */
const getOpenedAppFileWithPath = (uniqueMultiAppFileLinkedState, filePath) => {
  try {
    const { [OPENED_APP_FILES]: openedAppFiles } = uniqueMultiAppFileLinkedState.getState();
    const lenOpenedAppFiles = openedAppFiles.length;
  
    for (let i = 0; i < lenOpenedAppFiles; i++) {
      if (openedAppFiles[i].filePath === filePath) {
        return openedAppFiles[i];
      }
    }
  } catch (exc) {
    throw exc;
  }
};

export default getOpenedAppFileWithPath;