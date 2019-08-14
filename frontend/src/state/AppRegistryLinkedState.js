import PersistentStorageLinkedState, { EVT_LINKED_STATE_UPDATE } from './PersistentStorageLinkedState';

export {
  EVT_LINKED_STATE_UPDATE
};

export const APP_REGISTRATIONS_LINKED_SCOPE_NAME = 'appRegistrations';

console.warn('TODO: Implement persistent local storage of relevant window sizes and positions for AppRegistryLinkedState');

let _idxTick = -1;

/**
 * A registry of all registered app registrations for the Desktop.
 * 
 * @extends PersistentStorageLinkedState
 */
class AppRegistryLinkedState extends PersistentStorageLinkedState {
  constructor() {
    super(APP_REGISTRATIONS_LINKED_SCOPE_NAME, {
      // All registered AppRegistration instances
      appRegistrations: [],

      // 
      _idxTick
    });
  }

  /**
   * Registers a new application to be parsed by the Desktop.
   * 
   * @param {AppRegistration} appRegistration
   */
  addAppRegistration(appRegistration) {
    // Validate appRegistration type
    /*
    if (!(appRegistration instanceof AppRegistration)) {
      throw new Error('appRegistration must be an AppRegistration');
    }
    */

    let { appRegistrations } = this.getState();

    appRegistrations.push(appRegistration);

    this.setState({
      appRegistrations
    });
  }

  // TODO: Document
  removeAppRegistration(appRegistration) {
    let { appRegistrations } = this.getState();

    appRegistrations = appRegistrations.filter(testRegistration => {
      return !Object.is(testRegistration, appRegistration);
    });

    return appRegistrations;
  }

  /**
   * Internally bound by AppRegistration to each connected AppRuntime's
   * EVT_TICK.  This is mainly used to update AppRegistration listeners which
   * are sensitive to various AppRuntime instance activities.
   */
  emitProcessTick() {
    ++_idxTick

    this.setState({
      _idxTick
    });
  }

  // TODO: Document
  getAppRegistrations() {
    const { appRegistrations } = this.getState();

    return appRegistrations;
  }
}

export default AppRegistryLinkedState;