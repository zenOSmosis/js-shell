import UniqueLinkedState from './UniqueLinkedState';
import { dirDetail as socketFSDirDetail } from 'utils/socketFS';

export const ACTION_CHDIR = 'chdir';

export const ACTION_REQUEST_CREATE_FILE_DIALOG = 'requestCreateFile';
export const ACTION_REQUEST_CREATE_DIR_DIALOG = 'requestCreateDirectory';

export const STATE_CWD = 'cwd';
export const STATE_DIR_DETAIL = 'dirDetail';
export const STATE_FILE_CHOOSER_WINDOW = 'fileChooserWindow';
export const STATE_LAYOUT_TYPE = 'layoutType';
export const STATE_SELECTED_DIR_CHILDREN = 'selectedDirChildren';
export const STATE_IS_REQUESTING_CREATE_FILE = 'isRequestingCreateFile';
export const STATE_IS_REQUESTING_CREATE_DIRECTORY = 'isRequestingCreateDirectory';

class UniqueFileChooserLinkedState extends UniqueLinkedState {
  constructor() {
    super(`file-picker`, {
      [STATE_CWD]: '/',

      [STATE_DIR_DETAIL]: {},

      [STATE_FILE_CHOOSER_WINDOW]: null,

      [STATE_LAYOUT_TYPE]: null,
  
      [STATE_SELECTED_DIR_CHILDREN]: [],

      [STATE_IS_REQUESTING_CREATE_FILE]: false,
      [STATE_IS_REQUESTING_CREATE_DIRECTORY]: false
    }, {
      actions: {
        [ACTION_CHDIR]: async (path) => {
          try {
            const dirDetail = await socketFSDirDetail(path);
          
            this.setState({
              [STATE_CWD]: path,
              [STATE_DIR_DETAIL]: dirDetail
            });
          } catch (exc) {
            throw exc;
          }
        },

        [ACTION_REQUEST_CREATE_FILE_DIALOG]: () => {
          this.setState({
            isRequestingCreateFile: true
          });
        },

        [ACTION_REQUEST_CREATE_DIR_DIALOG]: () => {
          this.setState({
            isRequestingCreateDirectory: true
          });
        }
      }
    });
  }
}

export default UniqueFileChooserLinkedState;