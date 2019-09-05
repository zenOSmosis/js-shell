import { OPENED_APP_FILES } from 'state/UniqueMultiAppFileLinkedState';

/**
 * Locates the given AppFile by the given filePath and retrieves its index in
 * the UniqueMultiAppFileLinkedState OPENED_APP_FILES stack.
 * 
 * @param {SourceCodeAppLinkedState} uniqueMultiAppFileLinkedState 
 * @param {string} uuid
 * @return {number} -1 if the path is not in the index.
 */
const getOpenedAppFileIdxWithPath = (uniqueMultiAppFileLinkedState, filePath) => {
  const { [OPENED_APP_FILES]: openedAppFiles } = uniqueMultiAppFileLinkedState.getState();
  const lenOpenedAppFiles = openedAppFiles.length;

  for (let i = 0; i < lenOpenedAppFiles; i++) {
    if (openedAppFiles[i].filePath === filePath) {
      return i;
    }
  }

  return -1;
};

export default getOpenedAppFileIdxWithPath;