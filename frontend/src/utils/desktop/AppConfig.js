import EventEmitter from 'events';
import { desktopLinkedState } from './.common';
import AppConfigLinkedState from 'state/AppConfigLinkedState';
import uuidv4 from 'uuid/v4';

/**
 * AppConfig controls components, such as the Dock, and places menus
 * in them.
 * 
 * In order to create a new Dock item, simply create a new process with
 * an icon.
 * 
 * TODO: Revise this documentation as needed.
 * 
 * TODO: If not using events here, don't extend event emitter.
 */
export default class AppConfig extends EventEmitter {
  _defaultTitle = null;
  _title = null;
  _desktopWindows = [];
  _defaultIconSrc = null;
  _isRunning = false;
  _uuid = null;

  constructor(runProps) {
    super();

    this._uuid = uuidv4();

    const { title, iconSrc, mainWindow } = runProps;

    if (title) {
      this.setTitle(title);
    }

    if (iconSrc) {
      this.setIconSrc(iconSrc);
    }

    if (mainWindow) {
      this.addWindow(mainWindow);
    }

    const appConfigLinkedState = new AppConfigLinkedState();
    appConfigLinkedState.addAppConfig(this);
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
   * Note, this UUID is set dynamically during run-time and will not be
   * consistent across sessions or native reloads.
   */
  getUUID() {
    return this._uuid;
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

  addWindow(desktopWindow) {
    /*
    if (!(desktopWindow instanceof Window)) {
      throw new Error('desktopWindow must be a Window instance');
    }
    */

    this._desktopWindows.push(desktopWindow);
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

  launch() {
    if (this._isRunning) {
      console.warn('App is already running');
      return;
    }

    this._isRunning = true;

    desktopLinkedState.registerLaunchedAppConfig(this);
  }

  close() {
    if (!this._isRunning) {
      console.warn('App is not already running');
      return;
    }
    
    this._isRunning = false;

    desktopLinkedState.unregisterLaunchedAppConfig(this);
  }
}