import LinkedState from './LinkedState';
import mlscs from './controller/MasterLinkedStateController';

/**
 * Obtains an overview of all of LinkedState instances.
 */
export default class MasterLinkedStateListener extends LinkedState {
  constructor() {
    // TODO: Use constant for super name
    super('master-linked-state-listener', {
      mlscs
    });
  }

  getLinkedStateInstances() {
    return mlscs.getLinkedStateInstances();
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