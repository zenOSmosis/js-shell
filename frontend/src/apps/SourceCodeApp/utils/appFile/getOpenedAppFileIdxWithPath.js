import { OPENED_APP_FILES } from '../../state/UniqueSourceCodeAppLinkedState';

/**
 * @param {SourceCodeAppLinkedState} editorLinkedState 
 * @param {string} filePath
 * @return {number} -1 if the path is not in the index.
 */
const getOpenedAppFileIdxWithPath = (editorLinkedState, filePath) => {
  const { [OPENED_APP_FILES]: openedAppFiles } = editorLinkedState.getState();
  const lenOpenedAppFiles = openedAppFiles.length;

  for (let i = 0; i < lenOpenedAppFiles; i++) {
    if (openedAppFiles[i].filePath === filePath) {
      return i;
    }
  }

  return -1;
};

export default getOpenedAppFileIdxWithPath;