import { DESKTOP_CONTEXT_MENU_IS_TRAPPING, DESKTOP_DEFAULT_BACKGROUND_URL } from 'config';

// import Window from 'components/Desktop/Window';
// import App from '../utils/desktop/registerApp';
import hocConnect from './hocConnect';
import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';

export {
  EVT_LINKED_STATE_UPDATE,
  hocConnect
};

const DESKTOP_LINKED_SCOPE_NAME = 'desktop-linked-state';

export const ACTION_OPEN_FILE_CHOOSER_DIALOG = 'launchFileChooserDialog';
export const ACTION_CLOSE_FILE_CHOOSER_DIALOG = 'closeFileChooserDialog';
export const STATE_ACTIVE_FILE_CHOOSER_DIALOG_PARAMS = 'isShowingFileChooser';

export const STATE_CONTEXT_MENU_IS_TRAPPING = 'contextMenuIsTrapping';
export const STATE_LAST_NOTIFICATION = 'lastNotification';
export const STATE_REDIRECT_LOCATION = 'redirectLocation';
export const STATE_BACKGROUND_URL = 'backgroundURL';
export const STATE_IS_VIEWPORT_FOCUSED = 'isViewportFocused';
export const STATE_VIEWPORT_SIZE = 'viewportSize';
export const STATE_IS_FULLSCREEN_REQUESTED = 'isFullScreenRequested';
export const STATE_SHELL_DESKTOP_PROCESS = 'shellDesktopProcess';

/**
 * Maintains state directly related to the Shell Desktop and its running
 * applications.
 * 
 * @extends LinkedState
 */
class DesktopLinkedState extends LinkedState {
  constructor() {
    super(DESKTOP_LINKED_SCOPE_NAME, {
      // Whether, or not, the Desktop should capture right-click context menu
      [STATE_CONTEXT_MENU_IS_TRAPPING]: DESKTOP_CONTEXT_MENU_IS_TRAPPING,

      // Setting this will generate a new Desktop Notification
      // TODO: Typedef notification object
      // TODO: Move to NotificationLinkedState
      [STATE_LAST_NOTIFICATION]: {
        message: null,
        description: null,
        onClick: null
      },

      // URL redirect location
      [STATE_REDIRECT_LOCATION]: '/',

      // The background image location of the Desktop
      [STATE_BACKGROUND_URL]: DESKTOP_DEFAULT_BACKGROUND_URL,

      // Whether the browser window is focused or not
      // TODO: Rename [back] to viewportIsFocused
      [STATE_IS_VIEWPORT_FOCUSED]: true,

      // TODO: Create typedef for this
      [STATE_VIEWPORT_SIZE]: { width: 0, height: 0},

      // Whether the desktop is requested to be in full-screen mode
      [STATE_IS_FULLSCREEN_REQUESTED]: false,

      [STATE_SHELL_DESKTOP_PROCESS]: null,

      [STATE_ACTIVE_FILE_CHOOSER_DIALOG_PARAMS]: null
    }, {
      actions: {
        [ACTION_OPEN_FILE_CHOOSER_DIALOG]: (params) => {
          // const { appRuntime, fileChooserMode, filePath } = params;

          this.setState({
            [STATE_ACTIVE_FILE_CHOOSER_DIALOG_PARAMS]: params
          });
        },

        [ACTION_CLOSE_FILE_CHOOSER_DIALOG]: () => {
          this.setState({
            [STATE_ACTIVE_FILE_CHOOSER_DIALOG_PARAMS]: null
          });
        }
      }
    });
  }

  /**
   * This should only be run once.
   * 
   * @param {ShellDesktop} shellDesktopProcess
   */
  setShellDesktopProcess(shellDesktopProcess) {
    const { [STATE_SHELL_DESKTOP_PROCESS]: existingShellDesktopProcess } = this.getState();

    // Prevent multiple Desktop processes from being able to be run
    if (existingShellDesktopProcess) {
      throw new Error('Existing Shell Desktop process already set');
    }
    
    this.setState({
      [STATE_SHELL_DESKTOP_PROCESS]: shellDesktopProcess
    });
  }

  /** 
   * @return {ShellDesktop}
   */
  getShellDesktopProcess() {
    const { [STATE_SHELL_DESKTOP_PROCESS]: shellDesktopProcess } = this.getState();

    return shellDesktopProcess;
  }

  /**
   * Sets the Desktop's background URL.
   *
   * @param {string} backgroundURL 
   */
  setBackgroundURL(backgroundURL) {
    this.setState({
      [STATE_BACKGROUND_URL]: backgroundURL
    });
  }

  /**
   * Sets whether or not the Desktop should trap the right-click context menu.
   * 
   * @param {boolean} isTrapping
   */
  setContextMenuIsTrapping(isTrapping) {
    this.setState({
      [STATE_CONTEXT_MENU_IS_TRAPPING]: isTrapping
    });
  }

  /**
   * Retrieves whether or not the Desktop is trapping the right-click context menu.
   * 
   * @return {boolean}
   */
  getContextMenuIsTrapping() {
    const { [STATE_CONTEXT_MENU_IS_TRAPPING]: isTrapping } = this.getState();

    return isTrapping;
  }
}

export default DesktopLinkedState;