// TODO: Rename, and refactor, to ClientAppProcess (extends ClientProcess)

import ClientGUIProcess from 'process/ClientGUIProcess';
import Window from 'components/Desktop/Window';

export const EVT_CONTENT_UPDATE = 'content-update';
export const EVT_TITLE_UPDATE = 'title-update';
export const EVT_ICON_SRC_UPDATE = 'icon-src-update';

export default class App extends ClientGUIProcess {
  constructor(runProps) {
    // TODO: Construct super accordingly
    super(false);

    this._defaultTitle = null;
    this._windows = [];
    this._realWindow = null;
    this._defaultIconSrc = null;
    this._allowMultipleWindows = false;
    this._contentOverride = null;

    // TODO: Move these to app registration
    (() => {
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
    })();
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

  /**
   * Sets the real, non-composited window.
   * 
   * TODO: Remove this....
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
}