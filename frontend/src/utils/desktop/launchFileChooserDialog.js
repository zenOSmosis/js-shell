
import DesktopLinkedState, { 
  ACTION_OPEN_FILE_CHOOSER_DIALOG
} from 'state/DesktopLinkedState';

export const FILE_CHOOSER_MODE_OPEN = 'open';
export const FILE_CHOOSER_MODE_SAVE = 'save';
export const FILE_CHOOSER_MODE_SAVE_AS = 'saveAs';

const launchFileChooserDialog = (appRuntime, fileChooserMode, filePath = null) => {
  const desktopLinkedState = new DesktopLinkedState();
  // Open SocketFSFileChooserWindow in an overlay

  desktopLinkedState.dispatchAction(ACTION_OPEN_FILE_CHOOSER_DIALOG, {
    appRuntime,
    fileChooserMode,
    filePath
  });
};

export default launchFileChooserDialog;