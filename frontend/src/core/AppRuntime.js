import ClientGUIProcess, { EVT_BEFORE_EXIT, EVT_FIRST_RENDER, EVT_DIRECT_INTERACT } from 'process/ClientGUIProcess';
// import Window from 'components/Desktop/Window';
import { commonDesktopLinkedState } from 'state/commonLinkedStates';
import Menubar from './ShellDesktop/Menubar';

let focusedAppRuntime = null;

// export const EVT_CONTENT_UPDATE = 'content-update';
// export const EVT_TITLE_UPDATE = 'title-update';
// export const EVT_ICON_SRC_UPDATE = 'icon-src-update';

export const EVT_FOCUS = 'focus';
export const EVT_BLUR = 'blur';

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
    this._mainView = null;
    this._appCmd = null;
    this._isFocused = false;
    this._menubar = new Menubar(this);

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

  async _init() {
    try {
      this.on(EVT_FIRST_RENDER, () => {
        // Automatically focus on first render
        this.focus();
      });

      this.on(EVT_FOCUS, () => {
        // Ignore if already focused
        if (Object.is(this, focusedAppRuntime)) {
          return;
        }
  
        // Blur existing GUI process, if present
        if (focusedAppRuntime) {
          focusedAppRuntime.blur();
        }
  
        focusedAppRuntime = this;
        commonDesktopLinkedState.setFocusedAppRuntme(this);
      });

      // Focus when interacted with
      this.on(EVT_DIRECT_INTERACT, () => {
        this.focus();
      });

      this.once(EVT_BEFORE_EXIT, () => {
        if (Object.is(this, focusedAppRuntime)) {
          focusedAppRuntime = null;
          commonDesktopLinkedState.setFocusedAppRuntme(null);
        }
      });

      // Register app w/ view
      // Refer to components/Desktop/Window for example usage of app prop
      this.setViewProps({
        app: this
      });

      await super._init();
    } catch (exc) {
      throw exc;
    }
  }

  getMenubar() {
    return this._menubar;
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

  /**
   * Notifies all listeners that this process is the one the user is
   * interacting with directly.
   * 
   * TODO: Allow optional focus context so we can have independent channels
   * of focus.
   * 
   * Utilizes this.setIsFocused().
   */
  focus() {
    this.setIsFocused(true);
  }

  /**
   * Notifies all listeners that this process is no longer being interacted
   * with directly.
   * 
   * TODO: Allow optional focus context so we can have independent channels
   * of blur.
   * 
   * Utilizes this.setIsFocused().
   */
  blur() {
    this.setIsFocused(false);
  }

  /**
   * Sets whether or not this process' React.Component has top priority in the
   * UI (e.g. if a Window, this Window would be the currently focused Window).
   * 
   * Important! Handling of dynamically blurring other instances is not handled
   * directly in here.
   * 
   * @param {boolean} isFocused 
   */
  setIsFocused(isFocused) {
    // Ignore duplicate
    if (this._isFocused === isFocused) {
      console.warn('isFocused is already set to:', isFocused);
      return;
    }

    // TODO: Remove
    console.debug(`${isFocused ? 'Focusing' : 'Blurring'} app runtime`, this);

    this.setImmediate(() => {
      this._isFocused = isFocused;

      if (isFocused) {
        this.emit(EVT_FOCUS);
      } else {
        this.emit(EVT_BLUR);
      }
    });
  }

  /**
   * Retrieves whether or not this process is currently being interacted with
   * directly by the user.
   * 
   * @return {boolean}
   */
  getIsFocused() {
    return this._isFocused;
  }
}