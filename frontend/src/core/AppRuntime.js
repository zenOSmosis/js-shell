import ClientGUIProcess, { EVT_BEFORE_EXIT, EVT_FIRST_RENDER /*, REMOVE_THIS*/ } from 'process/ClientGUIProcess';
import DesktopLinkedState from 'state/DesktopLinkedState';
import Menubar from './ShellDesktop/Menubar';
import './AppRuntime.typedef';
//import { EVT_WINDOW_RESIZE } from 'process/ClientProcess';

const commonDesktopLinkedState = new DesktopLinkedState();

// export const EVT_CONTENT_UPDATE = 'content-update';
// export const EVT_TITLE_UPDATE = 'title-update';
// export const EVT_ICON_SRC_UPDATE = 'icon-src-update';

export const EVT_FOCUS = 'focus';
export const EVT_BLUR = 'blur';

/**
 * Application runtime for Shell Desktop.
 * 
 * @extends ClientGUIProcess
 */
class AppRuntime extends ClientGUIProcess {
  /**
   * @param {AppRuntimeRunProps} runProps 
   */
  constructor(runProps) {
    if (typeof runProps !== 'object') {
      throw new Error('runProps is not an object');
    }

    const shellDesktopProcess = commonDesktopLinkedState.getShellDesktopProcess();

    // Fork apps from the Shell Desktop Process (for now)
    super(shellDesktopProcess);

    this._defaultTitle = null;
    this._iconSrc = null;
    this._mainView = null;
    this._appCmd = null;
    this._isFocused = false;
    this._isMinimized = false;
    //TODO: do get set?
    this.menuItems = runProps.menuItems;

    this._menubar = new Menubar(this);

    


    (() => {
      // TODO: Create AppRuntime.typedef.js
      const { title, iconSrc, mainView, appCmd, cmd, position, size, cmdArguments } = runProps;


      this.setCmdArguments(cmdArguments);

      this._position = position;


      // cmd || appCmd are synonymous of each other
      const runCmd = appCmd || cmd;

      if (title) {
        this.setTitle(title);
      }

      if (position) {
        this.setInitPosition(position);
      }

      if (size) {
        this.setInitSize(size);
      }

      if (iconSrc) {
        this.setIconSrc(iconSrc);
      }

      if (mainView) {
        this.setMainWindow(mainView);
      }

      if (runCmd) {
        this.setImmediate(() => {
          this.evalInProcessContext(runCmd);
        });
      }
    })();
  }

  /**
   * TODO: Document
   * 
   * @return {Promise<void>}
   */
  async _init() {
    try {
      this.on(EVT_FIRST_RENDER, () => {
        // Automatically focus on first render
        this.focus();
      });

      this.on(EVT_FOCUS, () => {
        const focusedAppRuntime = commonDesktopLinkedState.getFocusedAppRuntime();
        console.log('received focus for', this._title, 'last focused was', focusedAppRuntime?focusedAppRuntime._title:'null')
        // Ignore if already focused
        /*if (Object.is(this, focusedAppRuntime)) {
          return;
        }*/
  
        // Blur existing GUI process, if present
        /*if (focusedAppRuntime) {
          focusedAppRuntime.blur();
        }*/
  
        commonDesktopLinkedState.setFocusedAppRuntime(this);
      });

      this.on(EVT_BLUR, () => {
        
      })

      // Register w/ DesktopLinkedState
      // Note (as of the time of writing) the underlying ClientProcess also
      // registers w/ ProcessLinkedState, however these usages are for
      // different purposes
      commonDesktopLinkedState.addLaunchedAppRuntime(this);

      this.once(EVT_BEFORE_EXIT, () => {
        const focusedAppRuntime = commonDesktopLinkedState.getFocusedAppRuntime();
        if (Object.is(this, focusedAppRuntime)) {

          const appRuntimeFocusOrder = commonDesktopLinkedState.getAppRuntimeFocusOrder();
          if(appRuntimeFocusOrder.length > 1) {
            // pass focus to latest focused window
            appRuntimeFocusOrder[appRuntimeFocusOrder.length - 2].focus();
          } else {
            commonDesktopLinkedState.setFocusedAppRuntime(null);
          }
        }
        
        // Unregister from DesktopLinkedState
        commonDesktopLinkedState.removeLaunchedAppRuntime(this);
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

  onMinimize() {
    this._isMinimized = true;
    commonDesktopLinkedState.setMinimizedAppRuntime(this);
  }

  onResizeMove(position, size) {
    if(position) {
      this.setInitPosition(position);
    }
    if(size) {
      this.setInitSize(size)
    }
  }

  /**
   * TODO: Document
   * 
   * @return {Menubar}
   */
  getMenubar() {
    return this._menubar;
  }

  /**
   * Retrieves the original title, before any modifications.
   * 
   * @return {string}
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

  // TODO: Rename to setView
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
    this._isMinimized = false;
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
    // TODO: Remove
    console.debug(`${isFocused ? 'Focusing' : 'Blurring'} app runtime`, this._title, this);

    // Ignore duplicate
    if (this._isFocused === isFocused) {
      console.warn('isFocused is already set to:', isFocused);
      return;
    }

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

export default AppRuntime;