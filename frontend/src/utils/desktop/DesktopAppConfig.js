import EventEmitter from 'events';
import { desktopLinkedState } from './.common';
import DesktopAppConfigLinkedState from 'state/DesktopAppConfigLinkedState';

/**
 * DesktopAppConfig controls components, such as the Dock, and places menus
 * in them.
 * 
 * In order to create a new Dock item, simply create a new process with
 * an icon.
 * 
 * TODO: Revise this documentation as needed.
 */
export default class DesktopAppConfig extends EventEmitter {
  _defaultTitle = null;
  _title = null;
  _desktopWindows = [];
  _defaultIconSrc = null;

  constructor(runProps) {
    super();

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

    const linkedState = new DesktopAppConfigLinkedState();
    linkedState.addAppConfig(this);
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

  addWindow(desktopWindow) {
    /*
    if (!(desktopWindow instanceof Window)) {
      throw new Error('desktopWindow must be a Window instance');
    }
    */

    this._desktopWindows.push(desktopWindow);
  }

  getMainWindow() {
    return this._desktopWindows[0];
  }

  getWindows() {
    return this._desktopWindows;
  }

  launch() {
    desktopLinkedState.launchAppConfig(this);
  }
}



