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
      lenLinkedStateInstances: 0
    });
  }

  getLinkedStateInstances() {
    return mlscs.getLinkedStateInstances();
  }

  getLinkedStateCount() {
    const { lenLinkedStateInstances } = this.getState();

    return lenLinkedStateInstances;
  }

  getLinkedStateInstancesByScopeName(linkedScopeName) {
    return mlscs.getLinkedStateInstancesByScopeName(linkedScopeName);
  }

  getLinkedStateInstanceByUuid(uuid) {
    const linkedStateInstances = this.getLinkedStateInstances();

    const linkedState = linkedStateInstances.reduce((a, b) => {
      if (a && a.getUuid() === uuid) {
        return a;
      }

      if (b && b.getUuid() === uuid) {
        return b;
      }

      return undefined;
    });

    return linkedState;
  }
};

mlscs.setMasterLinkedStateListenerClass(MasterLinkedStateListener);

export default MasterLinkedStateListener;