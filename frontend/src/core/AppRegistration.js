import EventEmitter from 'events';
import AppRuntime from './AppRuntime';
import { commonAppRegistryLinkedState } from 'state/commonLinkedStates';
import { EVT_BEFORE_EXIT } from 'process/ClientProcess';

/**
 * An app registration creates a new app available in any app menus in the
 * Desktop.
 * 
 * The items in the Dock represent a filtered subset of all available
 * registrations.
 * 
 * An app registration is an in-memory object, so this class should be
 * instantiated, per referenced app, each time the Desktop loads.
 */
export default class AppRegistration extends EventEmitter {
  constructor(runProps) {
    super();

    const {
        title,
        iconSrc,
        mainWindow,
        // allowMultipleWindows: propsAllowMultipleWindows
    } = runProps;

    this._isLaunched = false;
    this._appRuntime = null;

    this._title = title;
    this._iconSrc = iconSrc;
    this._mainWindow = mainWindow;

    // Convert to boolean from run property
    // this._allowMultipleWindows = (propsAllowMultipleWindows ? true : false);

    // Add this app registration to the registry
    commonAppRegistryLinkedState.addAppRegistration(this);
  }

  getIsLaunched() {
    return this._isLaunched;
  }

  async launchApp() {
    try {
      if (this._appRuntime) {
        // Gracefully fail
        console.warn('App is already launched, or is launching');
        return;
      }

      this._appRuntime = new AppRuntime({
        title: this._title,
        iconSrc: this._iconSrc,
        mainWindow: this._mainWindow
      });

      await this._appRuntime.onceReady();
  
      this._isLaunched = true;
  
      this._appRuntime.on(EVT_BEFORE_EXIT, () => {
        this._isLaunched = false;
        this._appRuntime = null;
      });
    } catch (exc) {
      throw exc;
    }
  }
  
  getAppRuntime() {
    return this._appRuntime;
  }

  async closeApp() {
    try {
      if (!this._appRuntime) {
        // Gracefully fail
        console.warn('appRuntime is not registered');
        return;
      }

      await this._appRuntime.close();
    } catch (exc) {
      throw exc;
    }
  }

  getTitle() {
    return this._title;
  }

  getIconSrc() {
    return this._iconSrc;
  }

  getMainWindow() {
    return this._mainWindow;
  }

  unregister() {
    // Remove this app registration from the registry
    commonAppRegistryLinkedState.removeAppRegistration(this);
  }
}