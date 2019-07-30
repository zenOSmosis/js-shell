import config from '../config';
// import Window from 'components/Desktop/Window';
// import App from '../utils/desktop/registerApp';
import hocConnect from './hocConnect';
import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';
import $ from 'jquery';

export {
  EVT_LINKED_STATE_UPDATE,
  hocConnect
};

const DESKTOP_LINKED_SCOPE_NAME = `desktopLinkedState`;

/**
 * Maintains state directly related to the Shell Desktop.
 * 
 * @extends LinkedState;
 */
class DesktopLinkedState extends LinkedState {
  constructor() {
    super(DESKTOP_LINKED_SCOPE_NAME, {
      // Whether, or not, the Desktop should capture right-click context menu
      contextMenuIsTrapping: config.DESKTOP_CONTEXT_MENU_IS_TRAPPING,

      // Setting this will generate a new Desktop Notification
      lastNotification: {
        message: null,
        description: null,
        onClick: null
      },

      // The most recent active Desktop window
      // TODO: Merge handling of active Window & focusedAppRuntime
      activeWindow: null,

      launchedAppRuntimes: [],

      // TODO: Differentiate between this and ProcessLinkedState.focusedGUIProcess
      focusedAppRuntime: null,

      // URL redirect location
      redirectLocation: '/',

      // A list of currently running apps
      // TODO: Remove this from this list; use a new Process/LinkedState, or etc.
      // launchedApps: [],

      // The background image location of the Desktop
      backgroundURI: config.DESKTOP_DEFAULT_BACKGROUND_URI,

      // Whether the browser window is focused or not
      isFocused: true
    });
  }

  /**
   * TODO: Document
   * 
   * @param {AppRuntime} appRuntime 
   */
  addLaunchedAppRuntime(appRuntime) {
    let { launchedAppRuntimes } = this.getState();

    launchedAppRuntimes.push(appRuntime);

    this.setState({
      launchedAppRuntimes
    });
  }

  /**
   * TODO: Document
   * 
   * @param {AppRuntime} appRuntime 
   */
  removeLaunchedAppRuntime(appRuntime) {
    let { launchedAppRuntimes } = this.getState();

    launchedAppRuntimes = launchedAppRuntimes.filter(testAppRuntime => {
      return !Object.is(appRuntime, testAppRuntime);
    });

    this.setState({
      launchedAppRuntimes
    });
  }

  /**
   * Sets the currently active Desktop window.
   *
   * @param {Object} activeWindow TODO: Use Window property.  It currently
   * conflicts w/ DOM Window. 
   */
  setActiveWindow(activeWindow) {
    console.warn('TODO: Redo setActiveWindow() handling work with DesktopChildGUIProcess');

    const { activeWindow: prevActiveWindow } = this.getState();

    // If previous active window is not the current active window
    if (!Object.is(activeWindow, prevActiveWindow)) {
      this.setState({
        activeWindow
      });
    }
  }

  getActiveWindow() {
    console.warn('TODO: Remove getActiveWindow()');

    const { activeWindow } = this.getState();

    return activeWindow;
  }

  /**
   * Sets the Desktop's background URI.
   *
   * @param {string} backgroundURI 
   */
  setBackgroundURI(backgroundURI) {
    this.setState({
      backgroundURI
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

  setFocusedAppRuntme(focusedAppRuntime) {
    this.setState({
      focusedAppRuntime
    });
  }

  getFocusedAppRuntime() {
    const { focusedAppRuntime } = this.state;

    return focusedAppRuntime;
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

// Handle Desktop blur / focus
// TODO: Move elsewhere
(() => {
  const desktopLinkedState = new DesktopLinkedState();

  // TODO: Use constants for "blur" / "focus"
  $(window).on('blur focus', function (e) {
    let prevType = $(this).data('prevType');

    let isFocused = true;

    if (prevType !== e.type) {   //  reduce double-fire issues
      switch (e.type) {
        case 'blur':
          isFocused = false;
          break;

        case 'focus':
          isFocused = true;
          break;

        default:
          // Ignore default case
          break;
      }
    }

    $(this).data("prevType", e.type);

    desktopLinkedState.setState({
      isFocused
    });
  });
})();

export default DesktopLinkedState;