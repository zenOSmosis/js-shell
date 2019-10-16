import { DESKTOP_CONTEXT_MENU_IS_TRAPPING, DESKTOP_DEFAULT_BACKGROUND_URL } from 'config';
import uuidv4 from 'uuidv4';

// import Window from 'components/Desktop/Window';
// import App from '../utils/desktop/registerApp';
import hocConnect from './hocConnect';
import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';

export {
  EVT_LINKED_STATE_UPDATE,
  hocConnect
};

const DESKTOP_LINKED_SCOPE_NAME = 'desktop-linked-state';

export const STATE_ACTIVE_FILE_CHOOSER_DIALOG_PARAMS = 'isShowingFileChooser';
export const STATE_CONTEXT_MENU_IS_TRAPPING = 'contextMenuIsTrapping';
export const STATE_LAST_NOTIFICATION = 'lastNotification';
export const STATE_REDIRECT_LOCATION = 'redirectLocation';
export const STATE_BACKGROUND_URL = 'backgroundUrl';
export const STATE_BACKGROUND_COMPONENT = 'backgroundComponent';
export const STATE_IS_VIEWPORT_FOCUSED = 'isViewportFocused';
export const STATE_VIEWPORT_SIZE = 'viewportSize';
export const STATE_IS_FULLSCREEN_REQUESTED = 'isFullScreenRequested';
export const STATE_SHELL_DESKTOP_PROCESS = 'shellDesktopProcess';
export const STATE_DESKTOP_MODALS = 'activeDesktopModals';

export const ACTION_OPEN_FILE_CHOOSER_DIALOG = 'launchFileChooserDialog';
export const ACTION_CLOSE_FILE_CHOOSER_DIALOG = 'closeFileChooserDialog';
export const ACTION_ADD_DESKTOP_MODAL = 'addDesktopModal';
export const ACTION_REMOVE_DESKTOP_MODAL_WITH_UUID = 'removeDesktopModal';

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

      [STATE_BACKGROUND_COMPONENT]: null,

      // Whether the browser window is focused or not
      // TODO: Rename [back] to viewportIsFocused
      [STATE_IS_VIEWPORT_FOCUSED]: true,

      // TODO: Create typedef for this
      [STATE_VIEWPORT_SIZE]: { width: 0, height: 0},

      // Whether the desktop is requested to be in full-screen mode
      [STATE_IS_FULLSCREEN_REQUESTED]: false,

      [STATE_SHELL_DESKTOP_PROCESS]: null,

      [STATE_ACTIVE_FILE_CHOOSER_DIALOG_PARAMS]: null,

      [STATE_DESKTOP_MODALS]: []
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
        },

        /**
         * @param {React.Component} Component React component to render as a Modal.
         * @return {string}
         */
        [ACTION_ADD_DESKTOP_MODAL]: (Component) => {
          const { [STATE_DESKTOP_MODALS]: desktopModals } = this.getState();

          const uuid = uuidv4();

          desktopModals.push({
            uuid,
            Component
          });

          this.setState({
            [STATE_DESKTOP_MODALS]: desktopModals
          });

          return uuid;
        },

        /**
         * @param {string} uuid
         */
        [ACTION_REMOVE_DESKTOP_MODAL_WITH_UUID]: (uuid) => {
          let { [STATE_DESKTOP_MODALS]: desktopModals } = this.getState();

          desktopModals = desktopModals.filter(modal => {
            const { uuid: testUuid } = modal;

            return testUuid !== uuid;
          });

          this.setState({
            [STATE_DESKTOP_MODALS]: desktopModals
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
   * @param {string} backgroundURL__ 
   */
  setBackgroundURL(backgroundURL__) {
    this.setState({
      [STATE_BACKGROUND_URL]: backgroundURL__
    });
  }

  /**
   * Sets the Desktop's background component.
   * 
   * @param {React.Component} reactComponent 
   */
  setBackgroundComponent(reactComponent) {
    this.setState({
      [STATE_BACKGROUND_COMPONENT]: reactComponent
    })
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