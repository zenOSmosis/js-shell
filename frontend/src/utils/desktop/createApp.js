import EventEmitter from 'events';
import { desktopLinkedState, commonAppLinkedState } from './.common';
import Window from 'components/Desktop/Window';
// import AppLinkedState from 'state/AppLinkedState';
import uuidv4 from 'uuid/v4';
import createDesktopNotification from './createDesktopNotification';
// import ReactDOM from 'react-dom';
// import StackTrace from 'stacktrace-js';

/*
if (module.hot) {
  // @see https://webpack.js.org/api/hot-module-replacement/#addstatushandler
  module.hot.addStatusHandler(status => {
    // React to the current status...
    console.warn('TODO: Handle module.hot status update:', status);
  });
}
*/

export const EVT_CONTENT_UPDATE = 'content-update';

/**
 * App controls components, such as the Dock, and places menus
 * in them.
 * 
 * In order to create a new Dock item, simply create a new process with
 * an icon.
 * 
 * TODO: Revise this documentation as needed.
 * 
 * TODO: If not using events here, don't extend event emitter.
 */
class App extends EventEmitter {
  _defaultTitle = null;
  _title = null;
  _desktopWindows = [];
  _realWindow = null;
  _defaultIconSrc = null;
  _isRunning = false;
  _uuid = null;
  _allowMultipleWindows = false;
  _contentOverride = null;

  constructor(runProps) {
    super();

    this._uuid = uuidv4();

    const { title, iconSrc, mainWindow, allowMultipleWindows: propsAllowMultipleWindows } = runProps;

    // Convert to boolean from run pproperty
    console.warn(`
        TODO: Handle allow/disallow multiple windows.
        Multiple windows should populate open options in the Dock, etc.
    `);
    this._allowMultipleWindows = (propsAllowMultipleWindows ? true : false);

    if (title) {
      this.setTitle(title);
    }

    if (iconSrc) {
      this.setIconSrc(iconSrc);
    }

    if (mainWindow) {
      this.addWindow(mainWindow);
    }
  }

  /**
   * Note, this UUID is set dynamically during run-time and will not be
   * consistent across sessions or native reloads.
   */
  getUUID() {
    return this._uuid;
  }

  setTitle(title) {
    if (!this._defaultTitle) {
      this._defaultTitle = title;
    }

    this._title = title;
  }

  getTitle() {
    return this._title;
  }

  /**
   * Retrieves the original title, before any modifications.
   */
  getDefaultTitle() {
    return this._defaultTitle;
  }

  setIconSrc(iconSrc) {
    this._defaultIconSrc = iconSrc;
  }

  getIconSrc() {
    return this._defaultIconSrc;
  }

  setContent(content) {
    this._contentOverride = content;

    this.emit(EVT_CONTENT_UPDATE, content);
  }

  getContentOverride() {
    return this._contentOverride;
  }

  /**
   * Note: DesktopWindow is likely not a Window instance, and only uses it
   * via composition.
   * 
   * TODO: Rename to setMainWindow
   * 
   * @param {*} desktopWindow 
   */
  addWindow(desktopWindow) {
    /*
    if (!(desktopWindow instanceof Window)) {
      throw new Error('desktopWindow must be a Window instance');
    }
    */

    this._desktopWindows.push(desktopWindow);
  }

  setMainWindow(desktopWindow) {
    if (this._desktopWindows.length) {
      throw new Error('MainWindow is already set');
    }

    this.addWindow(desktopWindow);
  }

  getMainWindow() {
    if (this._desktopWindows &&
        this._desktopWindows[0]) {
      return this._desktopWindows[0];
    }
  }

  getWindows() {
    return this._desktopWindows;
  }

  getIsRunning() {
    return this._isRunning;
  }

  /**
   * Sets the real, non-composited window.
   * 
   * @param {Window} realWindow 
   */
  setRealWindow(realWindow) {
    if (!(realWindow instanceof Window)) {
      throw new Error('realWindow must be a Window instance');
    }

    this._realWindow = realWindow;
  }

  getRealWindow() {
    return this._realWindow;
  }

  launch() {
    if (this._isRunning) {
      console.warn('App is already running');
      return;
    }

    this._isRunning = true;

    desktopLinkedState.registerLaunchedApp(this);
  }

  close() {
    if (!this._isRunning) {
      console.warn('App is not already running');
      return;
    }
    
    this._isRunning = false;

    desktopLinkedState.unregisterLaunchedApp(this);
  }

  destroy() {
    this.close();

    commonAppLinkedState.removeApp(this);
  }
}

const getWindowFilename = (appWindow) => {
  if (!appWindow) {
    return;
  }

  const {_source: appSource} = appWindow;
  if (!appSource) {
    return;
  }

  const {fileName: appFilename} = appSource;

  return appFilename;
};

// Note, currently this checks by looking at getMainWindow, and then
// backtracking to the window's filename.  This would be more robust by not
// requiring a window to be set.
const getExistingHMRApp = (app) => {
  if (!module.hot) {
    return;
  }

  const apps = commonAppLinkedState.getApps();

  const appMainWindow = app.getMainWindow();
  const appFilename = getWindowFilename(appMainWindow);
  if (!appFilename) {
    return;
  }

  for (let i = 0; i < apps.length; i++) {
    const testApp = apps[i];
    const testAppMainWindow = testApp.getMainWindow();
    const testAppFilename = getWindowFilename(testAppMainWindow);

    if (appFilename === testAppFilename) {
      return testApp;
    }
  }

  return;
};

const createApp = (appProps) => {
  const newApp = new App(appProps);
  const existingApp = getExistingHMRApp(newApp);

   // Don't re-add if app is already existing
  if (!existingApp) {
    commonAppLinkedState.addApp(newApp);
  }

  if (existingApp) {
    createDesktopNotification(`"${existingApp.getTitle()}" app source code updated`);
  }

  return existingApp || newApp;
};

export default createApp;
