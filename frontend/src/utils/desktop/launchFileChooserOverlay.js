
import DesktopLinkedState, { 
  ACTION_OPEN_FILE_CHOOSER
} from 'state/DesktopLinkedState';

const launchFileChooserOverlay = () => {
  const desktopLinkedState = new DesktopLinkedState();
  // Open SocketFSFileChooserWindow in an overlay

  desktopLinkedState.dispatchAction(ACTION_OPEN_FILE_CHOOSER);
};

export default launchFileChooserOverlay;