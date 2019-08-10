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
      lastNotification: {
        message: null,
        description: null,
        onClick: null
      },

      // The most recent active Desktop window
      // TODO: Merge handling of active Window & focusedAppRuntime
      activeWindow: null,

      shellDesktopProcess: null,

      // Running applications
      launchedAppRuntimes: [],

      // TODO: Document
      appRuntimeFocusOrder: [],

      // TODO: Differentiate between this and ProcessLinkedState.focusedGUIProcess
      focusedAppRuntime: null,

      // URL redirect location
      redirectLocation: '/',

      // The background image location of the Desktop
      backgroundURI: config.DESKTOP_DEFAULT_BACKGROUND_URI,

      // Whether the browser window is focused or not
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
   * TODO: Document
   * 
   * @param {AppRuntime} appRuntime 
   */
  addLaunchedAppRuntime(appRuntime) {
    let { launchedAppRuntimes, appRuntimeFocusOrder } = this.getState();

    // Add to launched app runtimes
    launchedAppRuntimes.push(appRuntime);
    
    // Add to focus ordering
    appRuntimeFocusOrder.push(appRuntime);

    this.setState({
      launchedAppRuntimes,
      appRuntimeFocusOrder
    });
  }

  /**
   * TODO: Document
   * 
   * @param {AppRuntime} appRuntime 
   */
  removeLaunchedAppRuntime(appRuntime) {
    let { launchedAppRuntimes, appRuntimeFocusOrder } = this.getState();

    // Remove from launched app runtimes
    launchedAppRuntimes = launchedAppRuntimes.filter(testAppRuntime => {
      return !Object.is(appRuntime, testAppRuntime);
    });

    // Remove from focus ordering
    appRuntimeFocusOrder = appRuntimeFocusOrder.filter(testAppRuntime => {
      return !Object.is(appRuntime, testAppRuntime);
    });

    this.setState({
      launchedAppRuntimes,
      appRuntimeFocusOrder
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

  setFocusedAppRuntime(newFocusedAppRuntime) {
    let { appRuntimeFocusOrder, focusedAppRuntime } = this.getState();
    //blur latest appRuntime
    if(focusedAppRuntime) {
      focusedAppRuntime.blur();
    }
    focusedAppRuntime = newFocusedAppRuntime;

    appRuntimeFocusOrder = appRuntimeFocusOrder.filter(testAppRuntime => {
      return !Object.is(focusedAppRuntime, testAppRuntime);
    });
    appRuntimeFocusOrder.push(focusedAppRuntime);
    this.setState({
      focusedAppRuntime,
      appRuntimeFocusOrder
    });
  }

  setMinimizedAppRuntime(minimizeAppRuntime) {
    let { appRuntimeFocusOrder } = this.getState();
    
    appRuntimeFocusOrder = [minimizeAppRuntime]
        .concat(appRuntimeFocusOrder
        .filter(testAppRuntime => {
      return !Object.is(minimizeAppRuntime, testAppRuntime) && !testAppRuntime._isMinimized;
    }));

    // pass focus
    if(appRuntimeFocusOrder.length > 1) {
      // pass focus to latest focused window
      appRuntimeFocusOrder[appRuntimeFocusOrder.length - 1].focus();
    } else {
      this.setFocusedAppRuntime(null);
    }

    this.setState({
      appRuntimeFocusOrder
    });
  }

  getFocusedAppRuntime() {
    const { focusedAppRuntime } = this.getState();
    return focusedAppRuntime;
  }

  getAppRuntimeFocusOrder() {
    const { appRuntimeFocusOrder } = this.getState();

    return appRuntimeFocusOrder;
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