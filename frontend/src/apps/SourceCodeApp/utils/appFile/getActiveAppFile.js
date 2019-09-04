import { ACTIVE_APP_FILE } from '../../state/UniqueSourceCodeAppLinkedState';

/**
 * Retrieves the currently active (or focused) AppFile.
 * 
 * @return {AppFile}
 */
const getActiveAppFile = (editorLinkedState) => {
  const { [ACTIVE_APP_FILE]: activeAppFile } = editorLinkedState.getState();

  return activeAppFile;
};

export default getActiveAppFile;