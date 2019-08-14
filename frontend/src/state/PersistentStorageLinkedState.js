import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';

export const PERSISTENT_STORAGE_LINKED_STATE_SCOPE_NAME = 'persistentStorage';

/**
 * @extends LinkedState
 */
class PersistentStorageLinkedState extends LinkedState {
  constructor(linkedStateScopeName = PERSISTENT_STORAGE_LINKED_STATE_SCOPE_NAME, defaultState = {}) {
    super(linkedStateScopeName, defaultState);

    console.warn('TODO: Detect if original instance and hydrate from persistent storage', this);
  }

  setState(updatedState, onSet = null) {
    // console.warn('TODO: Write updated state to persistent storage', updatedState);

    super.setState(updatedState, onSet);
  }
}

export default PersistentStorageLinkedState;
export {
  EVT_LINKED_STATE_UPDATE
};