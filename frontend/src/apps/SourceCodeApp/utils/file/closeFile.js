const closeFile = async (editorLinkedState, file) => {
  try {
    let { openedFiles, activeFile } = editorLinkedState.getState();

    if (Object.is(activeFile, file)) {
      // TODO: Set active file to next index...
      activeFile = null;
    }

    for (let i = 0; i < openedFiles.length; i++) {
      if (Object.is(file, openedFiles[i])) {
        openedFiles.splice(i, 1);    
      }
    }

    editorLinkedState.setState({
      activeFile,
      openedFiles
    });

  } catch (exc) {
    throw exc;
  }
};

export default closeFile;