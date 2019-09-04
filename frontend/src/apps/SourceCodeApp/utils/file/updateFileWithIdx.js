import { OPENED_FILES } from '../../state/UniqueSourceCodeAppLinkedState';

const updateFileWithIdx = (editorLinkedState, idx, updatedFileContent) => {
  let { [OPENED_FILES]: openedFiles } = editorLinkedState.getState();

  openedFiles[idx].fileContent = updatedFileContent;

  editorLinkedState.setState({
    [OPENED_FILES]: openedFiles
  });
};

export default updateFileWithIdx;