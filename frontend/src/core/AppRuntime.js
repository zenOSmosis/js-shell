import { EVT_EXIT, EVT_TICK } from 'process/ClientProcess';
import ClientGUIProcess, { EVT_FIRST_RENDER } from 'process/ClientGUIProcess';
import AppRuntimeLinkedState from 'state/AppRuntimeLinkedState';
import AppRegistration from './AppRegistration';
import { getShellDesktopProcess } from 'core/ShellDesktop'; // TODO: Move import
import AppRuntimeMenubar, { EVT_UPDATE as EVT_MENUBAR_UPDATE } from './ShellDesktop/AppRuntimeMenubar';

const _appRuntimeLinkedState = new AppRuntimeLinkedState();

export const EVT_FOCUS = 'focus';
export const EVT_BLUR = 'blur';
export {
  EVT_MENUBAR_UPDATE
};

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

    this._appRegistration = appRegistration;

    /**
     * @type {Window | null} Shell Desktop Window.
     */
    this._window = null;

    //TODO: do get set?
    // this.menuItems = runProps.menuItems || [];

    (() => {
      const appRegistrationProps = appRegistration.getProps();

      const {
        title,
        view: view,
        cmd: runCmd,
        menus: menusData
      } = appRegistrationProps;

      // Handle menubar
      (() => {
        this._menubar = new AppRuntimeMenubar(this, menusData);
        this._menubar.on(EVT_MENUBAR_UPDATE, () => {
          this.emit(EVT_MENUBAR_UPDATE);
        });
        this.once(EVT_EXIT, () => {
          this._menubar = null;
        });
      })();

      if (title) {
        this.setTitle(title);
      }

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
      // Register w/ DesktopLinkedState
      // Note (as of the time of writing) the underlying ClientProcess also
      // registers w/ ClientProcessLinkedState, however these usages are for
      // different purposes
      _appRuntimeLinkedState.addAppRuntime(this);

      this.once(EVT_FIRST_RENDER, () => {
        this.setImmediate(() => {
          this.focus();
        });
      });

      // Handle exit cleanup
      this.once(EVT_EXIT, () => {        
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

  /**
   * Retrieves the connected AppRegistration of this AppRuntime instance.
   * 
   * @return {AppRegistration}
   */
  getAppRegistration() {
    return this._appRegistration;
  }

  /**
   * TODO: Document
   * 
   * @return {AppRuntimeMenubar}
   */
  getMenubar() {
    return this._menubar;
  }

  /**
   * Sets menubar data, outside of System/App/Window default menus.
   * 
   * TODO: Document Object type
   * 
   * @param {Object[]} menusData 
   */
  setMenubarData(menusData) {
    this._menubar.setAuxMenusData(menusData);
  }

  /**
   * Retrieves menubar data, outside of System/App/Window default menus.
   * 
   * @return {Object[]}
   */
  getAppRuntimeMenubarData() {
    return this._menubar.getAuxMenusData();
  }

  setWindow(desktopWindow) {
    this.setImmediate(() => {
      this._window = desktopWindow;
    });
  }

  getWindowIfExists() {
    return this._window;
  }

  /**
   * Notifies all listeners that this process is the one the user is
   * interacting with directly.
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
   * Utilizes this.setIsFocused().
   */
  blur() {
    this.setIsFocused(false);
  }

  /**
   * Sets whether or not this process' React.Component has top priority in the
   * UI (e.g. if a Window, this Window would be the currently focused Window).
   * 
   * IMPORTANT! Handling of dynamically blurring other instances is not performed
   * directly in here.
   * 
   * @param {boolean} isFocused 
   */
  setIsFocused(isFocused) {
    // Don't check for existing focused state
    this._isFocused = isFocused;

    if (isFocused) {
      // This allows the AppRuntimeMenubar to accurately set on the first render by
      // waiting until it might have information
      _appRuntimeLinkedState.setFocusedAppRuntime(this);

      // Loop back focusing to Window, if not already set
      const desktopWindow = this.getWindowIfExists();
      if (desktopWindow && !desktopWindow.getIsFocused()) {
        desktopWindow.focus();
      }
      
      this.emit(EVT_FOCUS);
    } else {
      this.emit(EVT_BLUR);
    }
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

  /**
   * This should be called directly by the Window in order to record last window size.
   * 
   * @param {WindowSize} windowSize 
   */
  recordWindowSize(windowSize) {
    this._appRegistration.recordAppRuntimeWindowSize(this, windowSize);
  }

 /**
   * This should be called directly by the Window in order to record last window position.
   * 
   * @param {WindowPosition} windowPosition 
   */
  recordWindowPosition(windowPosition) {
    this._appRegistration.recordAppRuntimeWindowPosition(this, windowPosition);
  }
}

export default AppRuntime;