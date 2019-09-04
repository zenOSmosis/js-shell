import { OPENED_APP_FILES } from '../../state/UniqueSourceCodeAppLinkedState';

const updateAppFileWithIdx = (editorLinkedState, idx, updatedFileContent) => {
  let { [OPENED_APP_FILES]: openedAppFiles } = editorLinkedState.getState();

  openedAppFiles[idx].fileContent = updatedFileContent;

  editorLinkedState.setState({
    [OPENED_APP_FILES]: openedAppFiles
  });
};

export default updateAppFileWithIdx;