import UniqueLinkedState from 'state/UniqueLinkedState';

export const ACTION_CREATE_FILE = 'createFile';
export const ACTION_CREATE_DIRECTORY = 'createDirectory';

class UniqueSocketFSFilePickerLinkedState extends UniqueLinkedState {
  constructor() {
    super(`file-picker`, {
      cwd: '/',

      filePickerWindow: null,

      layoutType: null,
  
      selectedDirChildren: [],

      isRequestingCreateFile: false,
      isRequestingCreateDirectory: false
    }, {
      actions: {
        [ACTION_CREATE_FILE]: (linkedState, ...args) => {
          linkedState.setState({
            isRequestingCreateFile: true
          });
        },

        [ACTION_CREATE_DIRECTORY]: (linkedState, ...args) => {
          linkedState.setState({
            isRequestingCreateDirectory: true
          });
        }
      }
    });
  }
}

export default UniqueSocketFSFilePickerLinkedState;