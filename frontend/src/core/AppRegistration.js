import EventEmitter from 'events';
import AppRuntime from './AppRuntime';
import AppRegistryLinkedState from 'state/AppRegistryLinkedState';
import DesktopLinkedState from 'state/DesktopLinkedState';
import { EVT_EXIT /*, EVT_WINDOW_RESIZE*/} from 'process/ClientProcess';
import './AppRuntime.typedef';

const commonDesktopLinkedState = new DesktopLinkedState();
const commonAppRegistryLinkedState = new AppRegistryLinkedState();
let _createdWindowsCount = 0;






/**
 * Creates a registration which automatically populates app menus and the Dock
 * (if apps are launched, or they're pinned).
 * 
 * TODO: Move this comment to the Dock; The items in the Dock represent a
 * filtered subset of all available registrations.
 * 
 * In order to populate the Dock, and any relevant app menus, this class should
 * be instantiated for each referenced app.
 * 
 * @extends EventEmitter
 */
class AppRegistration extends EventEmitter {
  /**
   * 
   * @param {AppRuntimeRunProps} runProps 
   */
  constructor(runProps) {
    super();

    const {
        title,
        iconSrc,
        mainView,
        cmd: appCmd,
        supportedMimes,
        menuItems,
    } = runProps;

    this._isLaunched = false;
    this._appRuntime = [];

    this._title = title;
    this._iconSrc = iconSrc;
    this._mainView = mainView;
    this._appCmd = appCmd;

    this._menuItems = menuItems;

    this._position = {x: 0, y: 0};
    this._size = {width: 0, height: 0};

    this._isUnregistered = false;
    this._supportedMimes = supportedMimes || [];

    this._allowMultipleWindows = allowMultipleWindows;

    // Add this app registration to the registry
    commonAppRegistryLinkedState.addAppRegistration(this);
  }

  async launchApp(cmdArguments) {
    try {
      if (this._appRuntime.length && !this._allowMultipleWindows) {
        // Gracefully fail
        console.warn('App is already launched, or is launching');
        return;
      }

      if(this._position.x === 0 && this._position.y === 0 ){
        this._position = {x: _createdWindowsCount*20, y: _createdWindowsCount*20}
      }
      _createdWindowsCount++;
      
      const appRuntime = new AppRuntime({
        title: this._title,
        iconSrc: this._iconSrc,
        mainView: this._mainView,
        appCmd: this._appCmd,
        position: this._position,
        size: this._size,
        menuItems: this._menuItems,
        cmdArguments
      });
  
      const self = this;
      // Handle cleanup when the app exits
      this._appRuntime.on(EVT_EXIT, () => {
        this._isLaunched = false;
        this._appRuntime = null;

        // Emit to listeners that the app is closed
        commonAppRegistryLinkedState.emitRegistrationsUpdate();
      });

      await appRuntime.onceReady();

      this._appRuntime.push(appRuntime);
  
      this._isLaunched = true;

      // Emit to listeners that the app is launched
      commonAppRegistryLinkedState.emitRegistrationsUpdate();
    } catch (exc) {
      throw exc;
    }
  }

  getIsLaunched() {
    return this._isLaunched;
  }

  getAllowMultipleWindows() {
    return this._allowMultipleWindows;
  }
  
  /**
   * Retrieves the launched app's process runtime, if available.
   * 
   * @return {AppRuntime}
   */
  getAppRuntimes() {
    return this._appRuntime;
  }

  getSupportedMimes() {
    return this._supportedMimes;
  }

  async closeApp() {
    try {
      if (!this._appRuntime.length) {
        // Gracefully fail
        console.warn('appRuntime is not registered');
        return;
      }

      for(let i=0; i< this._appRuntime.length; i++){
        let appRuntime = this._appRuntime[i];
        await appRuntime.close();
      }

    } catch (exc) {
      throw exc;
    }
  }

  getTitle() {
    return this._title;
  }

  focus() {
    const appRuntimes = this.getAppRuntimes();

    const appRuntimeFocusOrder = commonDesktopLinkedState.getAppRuntimeFocusOrder();
    let linkedApps = [];

    if (Array.isArray(appRuntimeFocusOrder)) {
      linkedApps = appRuntimeFocusOrder.filter(a => (appRuntimes.indexOf(a)>-1));
    }

    linkedApps.forEach(a=> a.focus());
   }

  getIconSrc() {
    return this._iconSrc;
  }

  getMainWindow() {
    return this._mainView;
  }

  /**
   * Removes this app from the Desktop registry.
   * 
   * Important!  Once the app is unregistered, it is no longer available in the
   * Dock or any app menus.
   */
  async unregister() {
    try {
      if (this.getIsLaunched()) {
        const appRuntimes = this.getAppRuntimes();
        for(let i=0; i< appRuntimes.length; i++){
          let appRuntime = appRuntimes[i];
          await appRuntime.kill();
        }
      }
  
      commonAppRegistryLinkedState.removeAppRegistration(this);
  
      this._isUnregistered = true;
    } catch (exc) {
      throw exc;
    }
  }
}

export default AppRegistration;