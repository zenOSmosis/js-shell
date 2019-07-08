import EventEmitter from 'events';
import LinkedState, { EVT_LINKED_STATE_UPDATE } from '../LinkedState';
import { isNull } from 'util';

// Master controller events
export const EVT_ADDED_LINKED_STATE = 'added-linked-state';
export const EVT_UPDATED_SHARED_STATE = 'updated-shared-state';

// Switched to true after MasterLinkedStateControllerSingleton is instantiated
let _mlscsIsInstantiated = false;

/**
 * Master controller for all LinkedState instances.
 */
export class MasterLinkedStateControllerSingleton extends EventEmitter {
  constructor() {
    if (_mlscsIsInstantiated) {
      throw new Error('MasterLinkedStateControllerSingleton can only be instantiated once');
    }

    super();

    this._linkedStateInstances = [];
    this._sharedStates = {};
    this._masterLinkedStateListener = null;

    this._mlscsIsInstantiated = true;

    // Script needs to instantiate before master linked state listener is present
    setTimeout(() => {
      if (isNull(this._masterLinkedStateListener)) {
        throw new Error('No MasterLinkedStateListener set');
      }
    }, 0);
  }

  setMasterLinkedStateListenerClass(MasterLinkedStateListener) {
    if (this._masterLinkedStateListener) {
      throw new Error('MasterLinkedStateListener already set');
    }
    this._masterLinkedStateListener = new MasterLinkedStateListener();
    this._masterLinkedStateListener.setState({
      mlscs: this
    });
  }

  addLinkedState(linkedState, initialDefaultState = {}) {
    if (!(linkedState instanceof LinkedState)) {
      throw new Error('linkedState must be an instance of LinkedState');
    }

    const linkedScopeName = linkedState.getLinkedScopeName();

    // Keep record of class internally
    this._linkedStateInstances.push(linkedState);

    let isScopeOriginalInstance = null;

    // Register initial default state
    if (typeof this._sharedStates[linkedScopeName] === 'undefined') {
      this._sharedStates[linkedScopeName] = initialDefaultState;
      isScopeOriginalInstance = true;
    } else {
      isScopeOriginalInstance = false;
    }

    linkedState.mlscs_setIsScopeOriginalInstance(isScopeOriginalInstance, this);

    if (this._masterLinkedStateListener) {
      this._masterLinkedStateListener.broadcast(EVT_ADDED_LINKED_STATE, {
        linkedState,
        _rawDate: new Date(),
        _rawCallStack: new Error().stack
      });
    }

    // TODO: Debug if this is necessary (refer to initialDefaultState above)
    if (isScopeOriginalInstance) {
      linkedState.setState(initialDefaultState);
    }
  }

  removeLinkedStateWithUUID(uuid) {
    this._linkedStateInstances = this._linkedStateInstances.filter((linkedState) => {
      const linkedStateUUID = linkedState.getUUID();

      return (linkedStateUUID !== uuid);
    });
  }

  // TODO: Document differences between using this and broadcast; or privatize broadcast
  setSharedState(linkedState, updatedStateWithMetadata) {
    const linkedScopeName = linkedState.getLinkedScopeName();

    const {updatedState} = updatedStateWithMetadata;

    this._sharedStates[linkedScopeName] = Object.assign(this._sharedStates[linkedScopeName], updatedState);

    this.broadcast(linkedState, EVT_LINKED_STATE_UPDATE, updatedState);

    if (this._masterLinkedStateListener) {
      this._masterLinkedStateListener.broadcast(EVT_UPDATED_SHARED_STATE, {
        linkedState,
        ...updatedStateWithMetadata
        // callStack: new Error().stack
      });
    }
  }

  getSharedState(linkedState) {
    const linkedScopeName = linkedState.getLinkedScopeName();

    return this._sharedStates[linkedScopeName];
  }

  // TODO: Enable this to only work within self and MasterLinkedStateListener contexts
  broadcast(linkedState, eventName, ...args) {
    const linkedScopeName = linkedState.getLinkedScopeName();

    const broadcastInstances = this.getLinkedStateInstancesByScopeName(linkedScopeName);

    broadcastInstances.forEach((instance) => {
      instance.emit(eventName, ...args);
    });
  }

  getLinkedStateInstances() {
    return this._linkedStateInstances;
  }
  
  getLinkedStateInstancesByScopeName(linkedScopeName) {
    return this._linkedStateInstances.filter((testInstance) => {
      const testLinkedScopeName = testInstance.getLinkedScopeName();
      if (testLinkedScopeName !== linkedScopeName) {
        return false;
      }
  
      return true;
    });
  }
}

const mlscs = new MasterLinkedStateControllerSingleton();
export default mlscs;