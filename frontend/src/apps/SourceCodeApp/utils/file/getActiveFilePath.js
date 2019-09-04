import { ACTIVE_FILE } from '../../state/UniqueSourceCodeAppLinkedState';

const getActiveFilePath = (editorLinkedState) => {
  const { [ACTIVE_FILE]: activeFile } = editorLinkedState.getState();

  if (activeFile && activeFile.filePath) {
    const { filePath } = activeFile;

    return filePath;
  }
};

export default getActiveFilePath;