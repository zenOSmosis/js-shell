import '../../state/UniqueSourceCodeAppLinkedState';

/**
 * @param {SourceCodeAppLinkedState} editorLinkedState 
 * @param {string} filePath
 * @return {number} -1 if the path is not in the index.
 */
const getOpenedFileIdxWithPath = (editorLinkedState, filePath) => {
  const { openedFiles } = editorLinkedState.getState();
  const lenOpenedFiles = openedFiles.length;

  for (let i = 0; i < lenOpenedFiles; i++) {
    if (openedFiles[i].filePath === filePath) {
      return i;
    }
  }

  return -1;
};

export default getOpenedFileIdxWithPath;