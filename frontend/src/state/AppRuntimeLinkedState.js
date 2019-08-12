import RegistryLinkedState, { EVT_LINKED_STATE_UPDATE } from './RegistryLinkedState';

export {
  EVT_LINKED_STATE_UPDATE
};

export const APP_RUNTIMES_LINKED_SCOPE_NAME = 'appRuntimes';

/**
 * A registry of all running applications for the Desktop.
 * 
 * @extends RegistryLinkedState
 */
class AppRuntimeLinkedState extends RegistryLinkedState {
  constructor() {
    super(APP_RUNTIMES_LINKED_SCOPE_NAME, {
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

    super.addRegistration(appRuntime);
  }

  setFocusedAppRuntime(appRuntime) {
    this.setState({
      focusedAppRuntime: appRuntime
    });
  }

  // TODO: Document
  removeAppRuntime(appRuntime) {
    const { focusedAppRuntime } = this.getState();

    // Remove focused app runtime if this is the last runtime
    if (Object.is(focusedAppRuntime, appRuntime)) {
      this.setState({
        focusedAppRuntime: null
      });
    }

    super.removeRegistration(appRuntime);
  }

  // TODO: Document
  getAppRuntimes() {
    const appRegistrations = super.getRegistrations();

    return appRegistrations;
  }
}

export default AppRuntimeLinkedState;