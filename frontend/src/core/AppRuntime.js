import DesktopChildGUIProcess from 'process/DesktopChildGUIProcess';
// import Window from 'components/Desktop/Window';

// export const EVT_CONTENT_UPDATE = 'content-update';
// export const EVT_TITLE_UPDATE = 'title-update';
// export const EVT_ICON_SRC_UPDATE = 'icon-src-update';

export default class AppRuntime extends DesktopChildGUIProcess {
  // TODO: Replace runProps w/ process API
  constructor(runProps) {
    if (typeof runProps !== 'object') {
      throw new Error('runProps is not an object');
    }

    // TODO: Fork from Shell Desktop process (or other common base)
    super(false);

    this._defaultTitle = null;
    this._iconSrc = null;
    this._mainView = null;
    this._appCmd = null;

    // TODO: Move these to app registration
    (() => {
      const { title, iconSrc, mainView, appCmd } = runProps;

      if (title) {
        this.setTitle(title);
      }

      if (iconSrc) {
        this.setIconSrc(iconSrc);
      }

      if (mainView) {
        this.setMainWindow(mainView);
      }

      if (appCmd) {
        this.setImmediate(() => {
          this.evalInProcessContext(appCmd);
        });
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

  setMainWindow(mainView) {
    this.setView(mainView);
  }
}