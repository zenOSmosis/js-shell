import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';

export const DEFAULT_REGISTRY_LINKED_SCOPE_NAME = 'registrations';

export {
  EVT_LINKED_STATE_UPDATE
};

/**
 * A simple add / remove object management system.
 */
export default class RegistryLinkedState extends LinkedState {
  /**
   * @param {String} registryName This value reflects the property name of
   * the registry state array (e.g. if the registry name is "apps", it can be
   * deduced from the state by calling: const { apps } = this.getState() ). 
   */
  constructor(registryName = null) {
    registryName = registryName || DEFAULT_REGISTRY_LINKED_SCOPE_NAME;

    super(registryName, {
      [registryName]: []
    });

    this._registryName = registryName;
  }

   /**
   * @param {Object} registration Object to add to this registry.
   */
  addRegistration(registration) {
    const state = this.getState();
    let registrations = state[this._registryName];
    
    // Check for duplicates
    let hasDuplicate = false;
    registrations.forEach(testRegistration => {
      if (Object.is(registration, testRegistration)) {
        hasDuplicate = true;
      }
    });
    
    // Prevent duplicates; gracefully failing if present
    if (hasDuplicate) {
      console.warn('Registration is already added to RegistryLinkedState (no duplicates allowed)', registration, this);
      return;
    }

    registrations.push(registration);

    this.setState({
      [this._registryName]: registrations
    });
  }

  /**
   * 
   * @param {Object} registration Object to remove from this
   * registry. 
   */
  removeRegistration(registration) {
    const state = this.getState();
    let registrations = state[this._registryName];
    
    // Filter out given registration from the current registrations
    registrations = registrations.filter(testRegistration => {
      return !Object.is(registration, testRegistration);
    });

    // Write the filtered registrations
    this.setState({
      [this._registryName]: registrations
    });
  }

  /**
   * @return {Object[]}
   */
  getRegistrations() {
    const state = this.getState();
    const registrations = state[this._registryName];

    return registrations;
  }
}