import getOpenedFilePathIdx from './getOpenedFilePathIdx';

const activateFile = (editorLinkedState, file) => {
  try {
    const { openedFiles } = editorLinkedState.getState();
    const { filePath } = file;

    // If file already is opened, switch to it in the editor
    const openedFilePathIdx = getOpenedFilePathIdx(editorLinkedState, filePath);
    if (openedFilePathIdx > -1) {
      editorLinkedState.setState({
        activeFile: openedFiles[openedFilePathIdx]
      });
    } else {
      throw new Error('File is not available in the opened files stack.');
    }
  } catch (exc) {
    throw exc;
  }
};

export default activateFile;