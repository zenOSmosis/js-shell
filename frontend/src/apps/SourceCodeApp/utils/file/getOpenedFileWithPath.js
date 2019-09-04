const getOpenedFileWithPath = (editorLinkedState, filePath) => {
  try {
    const { openedFiles } = editorLinkedState.getState();
    const lenOpenedFiles = openedFiles.length;
  
    for (let i = 0; i < lenOpenedFiles; i++) {
      if (openedFiles[i].filePath === filePath) {
        return openedFiles[i];
      }
    }
  } catch (exc) {
    throw exc;
  }
};

export default getOpenedFileWithPath;