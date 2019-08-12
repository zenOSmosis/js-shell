import ClientGUIProcess, { EVT_BEFORE_EXIT, EVT_FIRST_RENDER, EVT_TICK /*, REMOVE_THIS*/ } from 'process/ClientGUIProcess';
import AppRuntimeLinkedState from 'state/AppRuntimeLinkedState';
import AppRegistration from './AppRegistration';
import { getShellDesktopProcess } from 'core/ShellDesktop'; // TODO: Move import
import Menubar from './ShellDesktop/Menubar';

const _appRuntimeLinkedState = new AppRuntimeLinkedState();

export const EVT_FOCUS = 'focus';
export const EVT_BLUR = 'blur';

/**
 * Application runtime for Shell Desktop.
 * 
 * @extends ClientGUIProcess
 */
class AppRuntime extends ClientGUIProcess {
  /**
   * @param {AppRegistration} appRegistration 
   */
  constructor(appRegistration) {
    if (!(appRegistration instanceof AppRegistration)) {
      throw new Error('appRegistration is not of AppRegistration type');
    }

    // Fork apps from the Shell Desktop Process (for now)
    // TODO: Fork from AppControlCentral
    const shellDesktopProcess = getShellDesktopProcess();
    super(shellDesktopProcess);

    // this._defaultTitle = null;
    // this._iconSrc = null;
    // this._mainView = null;
    // this._appCmd = null;

    // this._isFocused = false;
    // this._isMinimized = false;

    //TODO: do get set?
    // this.menuItems = runProps.menuItems || [];

    this._menubar = new Menubar(this);

    (() => {
      // TODO: Create AppRuntime.typedef.js
      /*
      const {
        title,
        iconSrc,
        view,
        appCmd,
        cmd,
        // position,
        // size,
        cmdArguments // TODO: Route these as view props?
      } = runProps;
      */

      // this.setCmdArguments(cmdArguments);

      // this._position = position;

      // cmd || appCmd are synonymous of each other
      // const runCmd = appCmd || cmd;

      const appRegistrationProps = appRegistration.getProps();

      const {
        title,
        mainView: view,
        cmd: runCmd
      } = appRegistrationProps;

      if (title) {
        this.setTitle(title);
      }

      /*
      if (position) {
        this.setInitPosition(position);
      }
      */

      /*
      if (size) {
        this.setInitSize(size);
      }
      */

      /*
      if (iconSrc) {
        this.setIconSrc(iconSrc);
      }
      */

      if (view) {
        this.setView(view);
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

      /*
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
  
        // commonDesktopLinkedState.setFocusedAppRuntime(this);
      // });


      // Register w/ DesktopLinkedState
      // Note (as of the time of writing) the underlying ClientProcess also
      // registers w/ ClientProcessLinkedState, however these usages are for
      // different purposes
      _appRuntimeLinkedState.addAppRuntime(this);

      this.once(EVT_BEFORE_EXIT, () => {
        /*
        const focusedAppRuntime = commonDesktopLinkedState.getFocusedAppRuntime();
        if (Object.is(this, focusedAppRuntime)) {

          const appRuntimeFocusOrder = commonDesktopLinkedState.getAppRuntimeFocusOrder();
          const lenAppRuntimeFocusOrder = appRuntimeFocusOrder.length;

          const lastFocusedRuntime = appRuntimeFocusOrder[lenAppRuntimeFocusOrder - 2];
          if(lastFocusedRuntime) {
            // pass focus to latest focused window
            lastFocusedRuntime.focus();
          } else {
            commonDesktopLinkedState.setFocusedAppRuntime(null);
          }
        }
        */
        
        // Unregister from DesktopLinkedState
        _appRuntimeLinkedState.removeAppRuntime(this);
      });

      // Handle tick functionality
      (() => {
        const _handleTick = () => {
          // Register / update appRuntime view property
          // Refer to components/Desktop/Window for example usage of app prop
          this.setViewProps({
            appRuntime: this
          });
        };

        // Dispatch to view on each process tick
        this.on(EVT_TICK, _handleTick);

        // Handle the initial tick
        _handleTick();
      })();

      await super._init();
    } catch (exc) {
      throw exc;
    }
  }

  /*
  onMinimize() {
    this._isMinimized = true;
    commonDesktopLinkedState.setMinimizedAppRuntime(this);
  }
  */

  // TODO: Move this elsewhere
  // TODO: Also add DesktopWindowSize

  /**
   * @typedef {Object} DesktopWindowPosition
   * @property {number} x 
   * @property {number} y 
   */

  /**
   * 
   * @param {DesktopWindowPosition} position 
   * @param {?} size // TODO: Determine size? 
   */
  /*
  onResizeMove(position, size) {
    if(position) {
      this.setInitPosition(position);
    }

    if(size) {
      this.setInitSize(size);
    }

    // console.warn('Has size?', (size ? 'yes' : 'no'), this);
  }
  */

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
  /*
  getDefaultTitle() {
    return this._defaultTitle;
  }
  */

  // TODO: Utilize ClientGUIProcess setIcon
  /*
  setIconSrc(iconSrc) {
    this._iconSrc = iconSrc;

    // this.emit(EVT_ICON_SRC_UPDATE, iconSrc);
  }
  */

  // TODO: Utilize ClientGUIProcess getIcon
  /*
  getIconSrc() {
    return this._iconSrc;
  }
  */

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
    // this._isMinimized = false;
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
   * Important! Handling of dynamically blurring other instances is not performed
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