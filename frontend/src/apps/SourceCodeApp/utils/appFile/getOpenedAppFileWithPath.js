import { OPENED_APP_FILES } from '../../state/UniqueSourceCodeAppLinkedState';

const getOpenedAppFileWithPath = (editorLinkedState, filePath) => {
  try {
    const { [OPENED_APP_FILES]: openedAppFiles } = editorLinkedState.getState();
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