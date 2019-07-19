import config from '../config';
// import Window from 'components/Desktop/Window';
// import App from '../utils/desktop/registerApp';
import hocConnect from './hocConnect';
import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';
import uuidv4 from 'uuid/v4';
import $ from 'jquery';

export {
  EVT_LINKED_STATE_UPDATE,
  hocConnect
};

const DESKTOP_LINKED_SCOPE_NAME = `desktop-linked-state-${uuidv4()}`;

export default class DesktopLinkedState extends LinkedState {
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
      // TODO: Merge handling of active Window & focusedDesktopChildGUIProcess
      activeWindow: null,

      focusedDesktopChildGUIProcess: null,

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
   * Sets the currently active Desktop window.
   *
   * @param {object} activeWindow TODO: Use Window property.  It currently
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

  setFocusedDesktopChildGUIProcess(focusedDesktopChildGUIProcess) {
    this.setState({
      focusedDesktopChildGUIProcess
    });
  }

  getFocuedDesktopChildGUIProcess() {
    const { focusedDesktopChildGUIProcess } = this.state;

    return focusedDesktopChildGUIProcess;
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