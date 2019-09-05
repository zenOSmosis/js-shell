import { ACTIVE_APP_FILE } from 'state/UniqueMultiAppFileLinkedState';

/**
 * Retrieves the currently active (or focused) AppFile.
 * 
 * @return {AppFile}
 */
const getActiveAppFile = (uniqueMultiAppFileLinkedState) => {
  const { [ACTIVE_APP_FILE]: activeAppFile } = uniqueMultiAppFileLinkedState.getState();

  return activeAppFile;
};

export default getActiveAppFile;