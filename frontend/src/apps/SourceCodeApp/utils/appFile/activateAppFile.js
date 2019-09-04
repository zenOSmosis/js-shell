import { ACTIVE_APP_FILE, OPENED_APP_FILES } from '../../state/UniqueSourceCodeAppLinkedState';
import getOpenedAppFileIdxWithPath from './getOpenedAppFileIdxWithPath';

/**
 * @param {UniqueSourceCodeAppLinkedState} editorLinkedState 
 * @param {AppFile} appFile 
 */
const activateAppFile = (editorLinkedState, appFile) => {
  try {
    const { [OPENED_APP_FILES]: openedAppFiles } = editorLinkedState.getState();
    const { filePath } = appFile;

    // If file already is opened, switch to it in the editor
    const openedFilePathIdx = getOpenedAppFileIdxWithPath(editorLinkedState, filePath);
    if (openedFilePathIdx > -1) {
      editorLinkedState.setState({
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