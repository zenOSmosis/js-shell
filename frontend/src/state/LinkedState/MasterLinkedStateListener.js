import LinkedState from './LinkedState';
import mlscs from './_masterController';

export const MASTER_LINKED_STATE_LISTENER_SCOPE_NAME = 'masterLinkedStateListenerScopeName';

/**
 * Obtains an overview of all LinkedState instances.
 * 
 * @extends LinkedState
 */
class MasterLinkedStateListener extends LinkedState {
  constructor() {
    super(MASTER_LINKED_STATE_LISTENER_SCOPE_NAME, {
      mlscs,
      lenLengthStates: 0
    });
  }

  getLinkedStateInstances() {
    return mlscs.getLinkedStateInstances();
  }

  getLinkedStateCount() {
    const { lenLengthStates } = this.getState();

    return lenLengthStates;
  }

  getLinkedStateInstancesByScopeName(linkedScopeName) {
    return mlscs.getLinkedStateInstancesByScopeName(linkedScopeName);
  }

  getLinkedStateInstanceByUUID(uuid) {
    const linkedStateInstances = this.getLinkedStateInstances();

    const linkedState = linkedStateInstances.reduce((a, b) => {
      if (a && a.getUUID() === uuid) {
        return a;
      }

      if (b && b.getUUID() === uuid) {
        return b;
      }

      return undefined;
    });

    return linkedState;
  }
};

mlscs.setMasterLinkedStateListenerClass(MasterLinkedStateListener);

export default MasterLinkedStateListener;