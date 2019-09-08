import ClientProcess, { EVT_EXIT } from 'process/ClientProcess';
import AppRegistration from '../AppRegistration';
import AppRuntime from '../AppRuntime';

let _appControlCentral = null;
let _appControlCentralHasExited = false;

/**
 * In-memory, one-to-one join of an AppRegistration & AppRuntime instance.
 * 
 * @typedef {Object} AppRegistrationRuntimeJoin
 * @property {AppRegistration} appRegistration
 * @property {AppRuntime} appRuntime
 */

/**
 * A collection of joined app registrations with app runtimes.
 * 
 * @type {AppRegistrationRuntimeJoin[]}
 */
let _appRegistrationRuntimeJoinStack = [];

/**
 * App Control Central manages all AppRuntimes instances.
 * 
 * @extends ClientProcess
 */
class AppControlCentral extends ClientProcess {
  constructor(...args) {
    if (_appControlCentral) {
      throw new Error('Another AppControlCentral already exists!');
    }

    super(...args);

    this.setTitle('App Control Central');

    // Handle cleanup before exit
    // This should never exit, actually
    this.on(EVT_EXIT, () => {
      _appControlCentral = null;
      _appControlCentralHasExited = true;
    });

    // Register process flag
    _appControlCentral = this;
  }

  /**
   * @param {AppRegistration} appRegistration
   * @return {Promise<AppRuntime>}
   */
  async launchAppRegistration(appRegistration, cmdArguments = []) {
    try {
      if (!(appRegistration instanceof AppRegistration)) {
        throw new Error('appRegistration is not an AppRegistration instance');
      }

      const appRuntimes = this.getJoinedAppRuntimesByRegistration(appRegistration);
      const allowMultipleWindows = appRegistration.getAllowMultipleWindows();

      if (appRuntimes.length && !allowMultipleWindows) {
        // Gracefully fail
        console.warn('App is already launched, or is launching');
        return false;
      }

      // Create the app process
      const appRuntime = new AppRuntime(appRegistration, cmdArguments);

      appRuntime.once(EVT_EXIT, () => {
        this._removeConnectedAppRuntime(appRuntime);
      });

      await appRuntime.onceReady();

      // Mount the new runtime to the runtimes stack
      _appRegistrationRuntimeJoinStack.push({
        appRegistration,
        appRuntime
      });

      return appRuntime;
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * @param {AppRegistration} appRegistration
   * @return {Promise<void>} 
   */
  async closeAllAppRuntimesByAppRegistration(appRegistration) {
    try {
      if (!(appRegistration instanceof AppRegistration)) {
        throw new Error('appRegistration is not an AppRegistration instance');
      }

      const joinedAppRuntimes = this.getJoinedAppRuntimesByRegistration(appRegistration);
      const lenJoinedAppRuntimes = joinedAppRuntimes.length;

      for (let i = 0; i < lenJoinedAppRuntimes; i++) {
        await joinedAppRuntimes[i].close();
      }
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * @param {AppRegistration} appRegistration 
   * @return {AppRuntime[]}
   */
  getJoinedAppRuntimesByRegistration(appRegistration) {
    if (!(appRegistration instanceof AppRegistration)) {
      throw new Error('appRegistration is not an AppRegistration instance');
    }

    const joins = _appRegistrationRuntimeJoinStack.filter(join => {
      return Object.is(join.appRegistration, appRegistration);
    });

    const appRuntimes = joins.map(join => {
      return join.appRuntime;
    });

    return appRuntimes;
  }

  /**
   * Removes the given AppRuntime from the internal _appRegistratinRuntimeJoinStack.
   * 
   * @param {AppRegistration} appRuntime 
   */
  _removeConnectedAppRuntime(appRuntime) {
    if (!(appRuntime instanceof AppRuntime)) {
      throw new Error('appRuntime is not an AppRuntime instance');
    }

    _appRegistrationRuntimeJoinStack = _appRegistrationRuntimeJoinStack.filter(testJoin => {
      const { appRuntime: testAppRuntime } = testJoin;

      return !Object.is(testAppRuntime, appRuntime);
    });
  }
}

//

/**
 * @return {AppLaunchController} A constructed instance of the
 * AppLaunchController
 */
const getAppControlCentral = () => {
  if (_appControlCentralHasExited) {
    console.warn('AppControlCentral has exited and can no longer be retrieved');
    return;
  } else if (!_appControlCentral) {
    throw new Error('AppControlCentral has not launched');
    return;
  }

  return _appControlCentral;
};

export default AppControlCentral;
export {
  getAppControlCentral
};