// TODO: Rename, and refactor, to ClientAppProcess (extends ClientProcess)

import EventEmitter from 'events';
import { commonDesktopLinkedState, commonAppLinkedState } from 'state/commonLinkedStates';
import Window from 'components/Desktop/Window';
// import AppLinkedState from 'state/AppLinkedState';
import uuidv4 from 'uuid/v4';

export const EVT_CONTENT_UPDATE = 'content-update';
export const EVT_TITLE_UPDATE = 'title-update';
export const EVT_ICON_SRC_UPDATE = 'icon-src-update';

/**
 * App controls components, such as the Dock, and places menus
 * in them.
 * 
 * In order to create a new Dock item, simply create a new process with
 * an icon.
 * 
 * TODO: Revise this documentation as needed.
 * 
 * TODO: Extend ClientGUIProcess
 * TODO: Rename to AppProcess
 */
export default class App extends EventEmitter {
  _defaultTitle = null;
  _title = null;
  _windows = [];
  _realWindow = null;
  _defaultIconSrc = null;
  _isRunning = false;
  _uuid = null;
  _allowMultipleWindows = false;
  _contentOverride = null;

  constructor(runProps) {
    super();

    console.warn('TODO: Utilize process model in app');

    this._uuid = uuidv4();

    const { title, iconSrc, mainWindow, allowMultipleWindows: propsAllowMultipleWindows } = runProps;

    // Convert to boolean from run property
    this._allowMultipleWindows = (propsAllowMultipleWindows ? true : false);

    if (title) {
      this.setTitle(title);
    }

    if (iconSrc) {
      this.setIconSrc(iconSrc);
    }

    if (mainWindow) {
      this.setMainWindow(mainWindow);
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

    this.emit(EVT_TITLE_UPDATE, title);
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

    this.emit(EVT_ICON_SRC_UPDATE, iconSrc);
  }

  getIconSrc() {
    return this._defaultIconSrc;
  }

  // TODO: Replace
  setContent(content) {
    this._contentOverride = content;

    this.emit(EVT_CONTENT_UPDATE, content);
  }

  // TODO: Remove(?)
  getContentOverride() {
    return this._contentOverride;
  }

  // TODO: Use setContent(...)
  setMainWindow(desktopWindow) {
    if (this._windows.length) {
      throw new Error('MainWindow is already set');
    }

    this._windows.push(desktopWindow);
  }

  /**
   * Note, may retrieve a Window composite, and not the actual window.
   * 
   * @see this.getRealWindow() to obtain a reference to the actual underlying window.
   */
  getMainWindow() {
    if (this._windows &&
        this._windows[0]) {
      return this._windows[0];
    }
  }

  getWindows() {
    return this._windows;
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

    // TODO: Launch new Process

    this._isRunning = true;

    commonDesktopLinkedState.registerLaunchedApp(this);
  }

  close() {
    if (!this._isRunning) {
      console.warn('App is not already running');
      return;
    }
    
    this._isRunning = false;

    commonDesktopLinkedState.unregisterLaunchedApp(this);
  }

  destroy() {
    this.close();

    commonAppLinkedState.removeApp(this);
  }
}