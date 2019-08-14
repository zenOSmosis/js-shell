import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';

export {
  EVT_LINKED_STATE_UPDATE
};

export const APP_RUNTIMES_LINKED_SCOPE_NAME = 'appRuntimes';

/**
 * A registry of all running applications for the Desktop.
 * 
 * @extends LinkedState
 */
class AppRuntimeLinkedState extends LinkedState {
  constructor() {
    super(APP_RUNTIMES_LINKED_SCOPE_NAME, {
      // All AppRuntime instances
      appRuntimes: [],
      
      // The most recently focused AppRuntime instance
      focusedAppRuntime: null
    });
  }

  addAppRuntime(appRuntime) {
    // Validate appRuntime type
    /*
    if (!(appRuntime instanceof AppRuntime)) {
      throw new Error('appRuntime must be an AppRuntime');
    }
    */

    let { appRuntimes } = this.getState();

    appRuntimes.push(appRuntime);

    this.setState({
      appRuntimes
    });
  }

  setFocusedAppRuntime(appRuntime) {
    this.setState({
      focusedAppRuntime: appRuntime
    });
  }

  // TODO: Document
  removeAppRuntime(appRuntime) {
    let { appRuntimes, focusedAppRuntime } = this.getState();

    // Remove focused app runtime if this is the last runtime
    if (Object.is(focusedAppRuntime, appRuntime)) {
      focusedAppRuntime = null;
    }

    appRuntimes = appRuntimes.filter(testRuntime => {
      return !Object.is(testRuntime, appRuntime);
    });

    this.setState({
      appRuntimes,
      focusedAppRuntime
    });
  }

  // TODO: Document
  getAppRuntimes() {
    const appRegistrations = super.getRegistrations();

    return appRegistrations;
  }
}

export default AppRuntimeLinkedState;