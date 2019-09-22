import { ACTIVE_APP_FILE, OPENED_APP_FILES } from 'state/UniqueMultiAppFileLinkedState';
import getOpenedAppFileIdxWithUuid from './getOpenedAppFileIdxWithUuid';

/**
 * Applies active state to the given AppFile.
 * 
 * @param {UniqueMultiAppFileLinkedState} uniqueMultiAppFileLinkedState 
 * @param {AppFile} appFile 
 */
const activateAppFile = (uniqueMultiAppFileLinkedState, appFile) => {
  try {
    const { [OPENED_APP_FILES]: openedAppFiles } = uniqueMultiAppFileLinkedState.getState();
    const { uuid } = appFile;

    // If file already is opened, switch to it in the editor
    const openedFilePathIdx = getOpenedAppFileIdxWithUuid(uniqueMultiAppFileLinkedState, uuid);
    if (openedFilePathIdx > -1) {
      uniqueMultiAppFileLinkedState.setState({
        [ACTIVE_APP_FILE]: openedAppFiles[openedFilePathIdx]
      });
    } else {
      throw new Error('File is not available in the opened app files stack.');
    }
  } catch (exc) {
    throw exc;
  }
};

export default activateAppFile;