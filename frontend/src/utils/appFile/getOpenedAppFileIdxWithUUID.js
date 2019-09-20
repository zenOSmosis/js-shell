import { OPENED_APP_FILES } from 'state/UniqueMultiAppFileLinkedState';

/**
 * Locates the given AppFile by the given UUID and retrieves its index in the
 * UniqueMultiAppFileLinkedState OPENED_APP_FILES stack.
 * 
 * @param {SourceCodeAppLinkedState} uniqueMultiAppFileLinkedState 
 * @param {string} uuid
 * @return {number} -1 if the path is not in the index.
 */
const getOpenedAppFileIdxWithUUID = (uniqueMultiAppFileLinkedState, uuid) => {
  const { [OPENED_APP_FILES]: openedAppFiles } = uniqueMultiAppFileLinkedState.getState();
  const lenOpenedAppFiles = openedAppFiles.length;

  for (let i = 0; i < lenOpenedAppFiles; i++) {
    if (openedAppFiles[i].uuid === uuid) {
      return i;
    }
  }

  return -1;
};

export default getOpenedAppFileIdxWithUUID;