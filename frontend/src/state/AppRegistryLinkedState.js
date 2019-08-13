import RegistryLinkedState, { EVT_LINKED_STATE_UPDATE } from './RegistryLinkedState';

export {
  EVT_LINKED_STATE_UPDATE
};

export const APP_REGISTRATIONS_LINKED_SCOPE_NAME = 'appRegistrations';

console.warn('TODO: Implement persistent local storage of relevant window sizes and positions for AppRegistryLinkedState');

/**
 * A registry of all registered app registrations for the Desktop.
 * 
 * @extends RegistryLinkedState
 */
class AppRegistryLinkedState extends RegistryLinkedState {
  constructor() {
    super(APP_REGISTRATIONS_LINKED_SCOPE_NAME);
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

    super.addRegistration(appRegistration);
  }

  // TODO: Document
  removeAppRegistration(appRegistration) {
    super.removeRegistration(appRegistration);
  }

  // TODO: Document
  getAppRegistrations() {
    const appRegistrations = super.getRegistrations();

    return appRegistrations;
  }
}

export default AppRegistryLinkedState;