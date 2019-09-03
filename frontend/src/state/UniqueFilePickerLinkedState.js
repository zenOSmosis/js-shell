import UniqueLinkedState from './UniqueLinkedState';
import { dirDetail as socketFSDirDetail } from 'utils/socketFS';

export const ACTION_CHDIR = 'chdir';

export const ACTION_REQUEST_CREATE_FILE_DIALOG = 'requestCreateFile';
export const ACTION_REQUEST_CREATE_DIR_DIALOG = 'requestCreateDirectory';

class UniqueFilePickerLinkedState extends UniqueLinkedState {
  constructor() {
    super(`file-picker`, {
      cwd: '/',

      dirDetail: {},

      filePickerWindow: null,

      layoutType: null,
  
      selectedDirChildren: [],

      isRequestingCreateFile: false,
      isRequestingCreateDirectory: false
    }, {
      actions: {
        [ACTION_CHDIR]: async (linkedState, path) => {
          try {
            const dirDetail = await socketFSDirDetail(path);
          
            linkedState.setState({
              cwd: path,
              dirDetail
            });
          } catch (exc) {
            throw exc;
          }
        },

        [ACTION_REQUEST_CREATE_FILE_DIALOG]: (linkedState, ...args) => {
          linkedState.setState({
            isRequestingCreateFile: true
          });
        },

        [ACTION_REQUEST_CREATE_DIR_DIALOG]: (linkedState, ...args) => {
          linkedState.setState({
            isRequestingCreateDirectory: true
          });
        }
      }
    });
  }
}

export default UniqueFilePickerLinkedState;