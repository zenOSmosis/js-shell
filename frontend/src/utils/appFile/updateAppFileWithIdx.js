import { OPENED_APP_FILES, /* ACTIVE_APP_FILE */ } from 'state/UniqueMultiAppFileLinkedState';

/**
 * 
 * @param {UniqueMultiAppFileLinkedState} uniqueMultiAppFileLinkedState 
 * @param {number} openedFileIdx 
 * @param {Object} updatedProperties 
 */
const updateAppFileWithIdx = (uniqueMultiAppFileLinkedState, openedFileIdx, updatedProperties = {}) => {
  if (typeof updatedProperties !== 'object') {
    throw new Error('updatedProperties must be an object');
  }

  let { [OPENED_APP_FILES]: openedAppFiles /*, [ACTIVE_APP_FILE]: activeAppFile */ } = uniqueMultiAppFileLinkedState.getState();

  if (!openedAppFiles[openedFileIdx]) {
    throw new Error(`openedAppFiles is missing index: ${openedFileIdx}`);
  }

  // const isActiveAppFile = Object.is(openedAppFiles[openedFileIdx], activeAppFile);

  // IMPORTANT! This mutates the current object's properties, but it is a lot
  // more efficient than overwriting the activeAppFile
  const updatedPropertyKeys = Object.keys(updatedProperties);
  const lenUpdatedPropertyKeys = updatedPropertyKeys.length;
  for (let i = 0; i < lenUpdatedPropertyKeys; i++) {
    openedAppFiles[openedFileIdx][updatedPropertyKeys[i]] = updatedProperties[updatedPropertyKeys[i]];
  }
  // or...
  // If setting a new object, the current activeAppFile is no longer
  // pointing to this openedAppFile, so it should be changed as well
  /*
  openedAppFiles[openedFileIdx] = {...openedAppFiles[openedFileIdx], ...updatedProperties};
  if (isActiveAppFile) {
    activeAppFile = openedAppFiles[openedFileIdx];
  }
  */

  uniqueMultiAppFileLinkedState.setState({
    [OPENED_APP_FILES]: openedAppFiles
    // [ACTIVE_APP_FILE]: activeAppFile
  });
};

export default updateAppFileWithIdx;