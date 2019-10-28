import EventEmitter from 'events';
import AppRuntime from './AppRuntime';
import AppRegistryLinkedState from 'state/AppRegistryLinkedState';
import { getAppControlCentral } from './ShellDesktop/AppControlCentral';
import { EVT_TICK, EVT_EXIT } from 'process/ClientProcess';
import './AppRegistration.typedefs.js';

const _appRegistryLinkedState = new AppRegistryLinkedState();

/**
 * Creates a registration which automatically populates app menus and the Dock
 * (if apps are launched, or they're pinned).
 * 
 * In order to populate the Dock, and any relevant app menus, this class should
 * be instantiated for each referenced app.
 * 
 * @extends EventEmitter
 */
class AppRegistration extends EventEmitter {
  /**
   * 
   * @param {AppRegistrationProps} appRegistrationProps 
   */
  constructor(appRegistrationProps) {
    super();

    const {
      title,
      iconView,
      view,
      cmd: runCmd,
      mimeTypes,
      menus,
      allowMultipleWindows,
      onExternalFileOpenRequest,
    } = appRegistrationProps;

    this._appRegistrationProps = appRegistrationProps;

    this._isLaunched = false;

    // TODO: Map all appRegistrationProps as properties
    this._title = title;
    this._iconView = iconView;
    this._view = view;
    this._runCmd = runCmd;

    this._menus = menus || [];

    // Previous position and size
    // this._lastPosition = { x: 0, y: 0 };
    // this._lastSize = { width: 0, height: 0 };

    this._isUnregistered = false;
    this._mimeTypes = mimeTypes || [];

    this._allowMultipleWindows = allowMultipleWindows;

    this._onExternalFileOpenRequest = onExternalFileOpenRequest;

    // Add this app registration to the registry
    _appRegistryLinkedState.addAppRegistration(this);
  }

  /**
   * @return {AppRegistrationProps}
   */
  getProps() {
    return this._appRegistrationProps;
  }

  /**
   * Note: This is placed in AppRegistration, instead of AppRuntime, as there
   * might not already be a running app when a file is requested to be opened.
   * 
   * @param {string} filePath
   * @return {Promise<void>}
   */
  async processFileOpenRequest(filePath) {
    try {
      const { onExternalFileOpenRequest } = this._appRegistrationProps;

      if (typeof onExternalFileOpenRequest !== 'function') {
        throw new Error(`No onExternalFileOpenRequest available for appRegistration with title: ${this._title}`);
      }

      let appRuntime;

      if (!this.getIsLaunched()) {
        appRuntime = await this.launch();
      } else {
        const joinedAppRuntimes = this.getJoinedAppRuntimes();

        // Use most recent appRuntime as the launcher
        // TODO: Launch in most recently focused AppRuntime
        appRuntime = joinedAppRuntimes[joinedAppRuntimes.length -1];

        // Focus existing AppRuntime instance
        appRuntime.focus();
      }

      await onExternalFileOpenRequest(appRuntime, filePath);
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * TODO: Rename to launch()
   * 
   * Launches an AppRuntime based on this registration.
   * 
   * @param {Object} cmdArguments? cmd data to be sent to the
   * AppRuntime instance.
   * @return {Promise<AppRuntime> | boolean}
   */
  async launch(cmdArguments = {}) {
    try {
      const appControlCentral = getAppControlCentral();

      const appRuntime = await appControlCentral.launchAppRegistration(this, cmdArguments);

      if (!(appRuntime instanceof AppRuntime)) {
        throw new Error('appRuntime is not an AppRuntime instance');
      }
      
      if (!appRuntime) {
        console.warn('AppControlCentral blocked launching of app registration', this);
        return;
      }

      appRuntime.on(EVT_TICK, () => {
        _appRegistryLinkedState.emitProcessTick();
      });

      // Important!  Wait until exit (not before exit)
      appRuntime.once(EVT_EXIT, () => {
        const appRuntimes = this.getJoinedAppRuntimes();

        if (!appRuntimes.length) {
          // All connected AppRuntime instances are closed
          this._setIsLaunched(false);
        }
      });

      this._setIsLaunched(true);

      return appRuntime;
    } catch (exc) {
      throw exc;
    }
  }

  async closeAllJoinedApps() {
    try {
      const appControlCentral = getAppControlCentral();
      return await appControlCentral.closeAllAppRuntimesByAppRegistration(this);
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Internally sets whether or not there are connected AppRuntime instances.
   * 
   * @param {boolean} isLaunched 
   */
  _setIsLaunched(isLaunched) {
    this._isLaunched = isLaunched;

    _appRegistryLinkedState.emitProcessTick();
  }

  /**
   * Retrieves whether or not there are connected AppRuntime instances.
   * 
   * @return {boolean}
   */
  getIsLaunched() {
    return this._isLaunched;
  }

  /**
   * @return {boolean} Whether multiple instances of this View (or Window) are
   * allowed.
   */
  getAllowMultipleWindows() {
    return this._allowMultipleWindows;
  }

  getMenus() {
    return this._menus;
  }

  /**
   * Retrieves the launched app's process runtimes, if available.
   * 
   * @return {AppRuntime[]}
   */
  getJoinedAppRuntimes() {
    const appControlCentral = getAppControlCentral();

    if (!appControlCentral) {
      return [];
    }

    return appControlCentral.getJoinedAppRuntimesByRegistration(this);
  }

  /**
   * TODO: Document
   * TODO: Rename to getSupportedMimeTypes
   */
  getMimeTypes() {
    return this._mimeTypes;
  }

  /**
   * @return {string}
   */
  getTitle() {
    return this._title;
  }

  getIconView() {
    return this._iconView;
  }

  /**
   * @return {React.Component}
   */
  getView() {
    return this.view;
  }

  /**
   * Records the Window size in the given AppRuntime instance.
   * 
   * IMPORTANT! This should only be called by a Window component.
   * 
   * @param {AppRuntime} appRuntime 
   * @param {WindowSize} windowSize
   */
  recordAppRuntimeWindowSize(appRuntime, windowSize) {
    /*
    console.debug('TODO: Record app runtime window size', {
      appRuntime,
      windowSize
    });
    */
  }

  /**
   * Records the Window position in the given AppRuntime instance.
   * 
   * IMPORTANT! This should only be called by a Window component.
   * 
   * @param {AppRuntime} appRuntime 
   * @param {WindowPosition} windowPosition 
   */
  recordAppRuntimeWindowPosition(appRuntime, windowPosition) {
    /*
    console.debug('TODO: Record app runtime window position', {
      appRuntime,
      windowPosition
    });
    */
  }

  /**
   * Utilized to store metadata related to this AppRegistration. 
   * 
   * @return {string}
   */
  /*
  getSerializedRegistration() {
  }
  */

  /**
   * Removes this app (and all connected runtimes) from the Desktop registry.
   * 
   * Important!  Once the app is unregistered, it is no longer available in the
   * Dock or any app menus.
   */
  async unregister() {
    try {
      if (this.getIsLaunched()) {
        await this.closeAllJoinedApps();
      }

      // Remove from LinkedState
      _appRegistryLinkedState.removeAppRegistration(this);

      this._isUnregistered = true;
    } catch (exc) {
      throw exc;
    }
  }
}

export default AppRegistration;