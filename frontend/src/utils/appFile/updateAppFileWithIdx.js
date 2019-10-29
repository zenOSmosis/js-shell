import { OPENED_APP_FILES, ACTIVE_APP_FILE } from 'state/UniqueMultiAppFileLinkedState';

/**
 * @param {UniqueMultiAppFileLinkedState} uniqueMultiAppFileLinkedState 
 * @param {number} openedFileIdx 
 * @param {Object} updatedProperties 
 */
const updateAppFileWithIdx = (uniqueMultiAppFileLinkedState, openedFileIdx, updatedProperties = {}) => {
  if (typeof updatedProperties !== 'object') {
    throw new Error('updatedProperties must be an object');
  }

  let {
    [OPENED_APP_FILES]: openedAppFiles,
    [ACTIVE_APP_FILE]: activeAppFile
  } = uniqueMultiAppFileLinkedState.getState();

  if (!openedAppFiles[openedFileIdx]) {
    throw new Error(`openedAppFiles is missing index: ${openedFileIdx}`);
  }

  const isActiveAppFile = Object.is(openedAppFiles[openedFileIdx], activeAppFile);

  const modAppFile = openedAppFiles[openedFileIdx];
  
  // Merge existing meta in w/ updatedProperties
  const meta = {    
    // Existing meta properties
    ...modAppFile['meta'],
    
    // Overwritten meta properties
    ...updatedProperties['meta']
  };
  updatedProperties.meta = meta;
  
  // Merge in merged updatedProperties w/ existing meta into current openedAppFile
  const wb = {...modAppFile, ...updatedProperties};

  const { fileContent, nonModifiedFileContent } = wb;
  const isModified = (fileContent !== nonModifiedFileContent);
  wb['isModified'] = isModified;

  openedAppFiles[openedFileIdx] = wb;
  
  const filteredUpdatedState = {
    [OPENED_APP_FILES]: openedAppFiles
  };

  if (isActiveAppFile) {
    activeAppFile = openedAppFiles[openedFileIdx];
    filteredUpdatedState[ACTIVE_APP_FILE] = activeAppFile;
  }

  // Set the updated state
  uniqueMultiAppFileLinkedState.setState(filteredUpdatedState);
};

export default updateAppFileWithIdx;