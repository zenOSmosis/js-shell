import ClientGUIProcess from 'process/ClientGUIProcess';
// import Window from 'components/Desktop/Window';

// export const EVT_CONTENT_UPDATE = 'content-update';
// export const EVT_TITLE_UPDATE = 'title-update';
// export const EVT_ICON_SRC_UPDATE = 'icon-src-update';

export default class AppRuntime extends ClientGUIProcess {
  // TODO: Replace runProps w/ process API
  constructor(runProps) {
    if (typeof runProps !== 'object') {
      throw new Error('runProps is not an object');
    }

    // TODO: Fork from Shell Desktop process (or other common base)
    super(false);

    this._defaultTitle = null;
    this._iconSrc = null;
    this._mainWindow = null;

    // TODO: Move these to app registration
    (() => {
      const { title, iconSrc, mainWindow } = runProps;

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

  // TODO: Utilize ClientGUIProcess setIcon
  setIconSrc(iconSrc) {
    this._iconSrc = iconSrc;

    // this.emit(EVT_ICON_SRC_UPDATE, iconSrc);
  }

  // TODO: Utilize ClientGUIProcess getIcon
  getIconSrc() {
    return this._iconSrc;
  }

  setMainWindow(mainWindow) {
    this.setContent(mainWindow);
  }
}