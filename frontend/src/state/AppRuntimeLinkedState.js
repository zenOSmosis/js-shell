import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';
import { getShellDesktopProcess } from 'core/ShellDesktop';

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

    appRuntimes = appRuntimes.filter(testRuntime => {
      return !Object.is(testRuntime, appRuntime);
    });

    this.setState({
      appRuntimes,
      focusedAppRuntime
    });

    // Revert to ShellDesktopProcess if the other apps are closed
    if (appRuntimes.length === 1) {
      const shellDesktopProcess = getShellDesktopProcess();
      
      shellDesktopProcess.focus();
    }
  }

  // TODO: Document
  getAppRuntimes() {
    const appRegistrations = super.getRegistrations();

    return appRegistrations;
  }
}

export default AppRuntimeLinkedState;