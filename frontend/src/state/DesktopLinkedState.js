import config from '../config';
// import Window from 'components/Desktop/Window';
// import App from '../utils/desktop/registerApp';
import hocConnect from './hocConnect';
import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';

export {
  EVT_LINKED_STATE_UPDATE,
  hocConnect
};

const DESKTOP_LINKED_SCOPE_NAME = `desktopLinkedState`;

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
      contextMenuIsTrapping: config.DESKTOP_CONTEXT_MENU_IS_TRAPPING,

      // Setting this will generate a new Desktop Notification
      // TODO: Typedef notification object
      // TODO: Move to NotificationLinkedState
      lastNotification: {
        message: null,
        description: null,
        onClick: null
      },

      // URL redirect location
      redirectLocation: '/',

      // The background image location of the Desktop
      backgroundURL: config.DESKTOP_DEFAULT_BACKGROUND_URL,

      // Whether the browser window is focused or not
      // TODO: Rename [back] to viewportIsFocused
      isViewportFocused: true,

      // TODO: Create typedef for this
      viewportSize: { width: 0, height: 0},

      // Whether the desktop is requested to be in full-screen mode
      isFullScreenRequested: false
    });
  }

  /**
   * This should only be run once.
   * 
   * @param {ShellDesktop} shellDesktopProcess
   */
  setShellDesktopProcess(shellDesktopProcess) {
    const { shellDesktopProcess: existingShellDesktopProcess } = this.getState();

    // Prevent multiple Desktop processes from being able to be run
    if (existingShellDesktopProcess) {
      throw new Error('Existing Shell Desktop process already set');
    }
    
    this.setState({
      shellDesktopProcess
    });
  }

  /** 
   * @return {ShellDesktop}
   */
  getShellDesktopProcess() {
    const { shellDesktopProcess } = this.getState();

    return shellDesktopProcess;
  }

  /**
   * Sets the Desktop's background URL.
   *
   * @param {string} backgroundURL 
   */
  setBackgroundURL(backgroundURL) {
    this.setState({
      backgroundURL
    });
  }

  /**
   * Sets whether or not the Desktop should trap the right-click context menu.
   * 
   * @param {boolean} contextMenuIsTrapping 
   */
  setContextMenuIsTrapping(contextMenuIsTrapping) {
    this.setState({
      contextMenuIsTrapping
    });
  }

  /**
   * Retrieves whether or not the Desktop is trapping the right-click context menu.
   * 
   * @return {boolean}
   */
  getContextMenuIsTrapping() {
    const { contextMenuIsTrapping } = this.getState();

    return contextMenuIsTrapping;
  }
}

export default DesktopLinkedState;