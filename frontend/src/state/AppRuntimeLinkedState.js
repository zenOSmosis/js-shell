import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';
import { getShellDesktopProcess } from 'core/ShellDesktop';

export {
  EVT_LINKED_STATE_UPDATE
};

export const APP_RUNTIMES_LINKED_SCOPE_NAME = 'appRuntimes';

export const STATE_APP_RUNTIMES = 'appRuntimes';
export const STATE_FOCUSED_APP_RUNTIME = 'focusedAppRuntime';

/**
 * A registry of all running applications for the Desktop.
 * 
 * @extends LinkedState
 */
class AppRuntimeLinkedState extends LinkedState {
  constructor() {
    super(APP_RUNTIMES_LINKED_SCOPE_NAME, {
      // All AppRuntime instances
      [STATE_APP_RUNTIMES]: [],

      // The most recently focused AppRuntime instance
      [STATE_FOCUSED_APP_RUNTIME]: null
    });
  }

  addAppRuntime(appRuntime) {
    // Validate appRuntime type
    /*
    if (!(appRuntime instanceof AppRuntime)) {
      throw new Error('appRuntime must be an AppRuntime');
    }
    */

    let { [STATE_APP_RUNTIMES]: appRuntimes } = this.getState();

    appRuntimes.push(appRuntime);

    this.setState({
      [STATE_APP_RUNTIMES]: appRuntimes
    });
  }

  setFocusedAppRuntime(appRuntime) {
    this.setState({
      focusedAppRuntime: appRuntime
    });
  }

  // TODO: Document
  removeAppRuntime(appRuntime) {
    let {
      [STATE_APP_RUNTIMES]: appRuntimes,
      [STATE_FOCUSED_APP_RUNTIME]: focusedAppRuntime
    } = this.getState();

    appRuntimes = appRuntimes.filter(testRuntime => {
      return !Object.is(testRuntime, appRuntime);
    });

    this.setState({
      [STATE_APP_RUNTIMES]: appRuntimes,
      [STATE_FOCUSED_APP_RUNTIME]: focusedAppRuntime
    });

    // Revert to ShellDesktopProcess if the other apps are closed
    if (appRuntimes.length === 1) {
      const shellDesktopProcess = getShellDesktopProcess();

      shellDesktopProcess.focus();
    }
  }
}

export default AppRuntimeLinkedState;