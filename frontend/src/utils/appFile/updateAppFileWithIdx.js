import { OPENED_APP_FILES } from 'state/UniqueMultiAppFileLinkedState';

const updateAppFileWithIdx = (uniqueMultiAppFileLinkedState, idx, updatedFileContent) => {
  let { [OPENED_APP_FILES]: openedAppFiles } = uniqueMultiAppFileLinkedState.getState();

  openedAppFiles[idx].fileContent = updatedFileContent;

  uniqueMultiAppFileLinkedState.setState({
    [OPENED_APP_FILES]: openedAppFiles
  });
};

export default updateAppFileWithIdx;