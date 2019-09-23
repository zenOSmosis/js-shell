import EventEmitter from 'events';
import LinkedState, { EVT_LINKED_STATE_UPDATE } from './LinkedState';

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
    } else {
      _mlscsIsInstantiated = true;
    }

    super();

    this._linkedStateInstances = [];
    this._sharedStates = {};
    this._masterLinkedStateListener = null;

    // Script needs to instantiate before master linked state listener is present
    setTimeout(() => {
      if (!this._masterLinkedStateListener) {
        throw new Error('No MasterLinkedStateListener set');
      }
    }, 0);
  }

  /**
   * Registers the MasterLinkedStateListener class.
   * 
   * @param {MasterLinkedStateListener} MasterLinkedStateListener IMPORTANT!
   * This is the class, not the instance.
   */
  setMasterLinkedStateListenerClass(MasterLinkedStateListener) {
    if (this._masterLinkedStateListener) {
      throw new Error('MasterLinkedStateListener already set');
    }

    this._masterLinkedStateListener = new MasterLinkedStateListener();
    this._masterLinkedStateListener.setState({
      mlscs: this
    });
  }

  /**
   * Registers a LinkedState instance with the master controller.
   * 
   * @param {LinkedState} linkedState 
   * @param {Object} initialDefaultState 
   */
  addLinkedState(linkedState, initialDefaultState = {}) {
    if (!(linkedState instanceof LinkedState)) {
      throw new Error('linkedState must be an instance of LinkedState');
    }

    const linkedScopeName = linkedState.getLinkedScopeName();

    // Keep record of class internally
    this._linkedStateInstances.push(linkedState);

    let isScopeOriginalInstance = null;

    // Register initial default state
    if (this._sharedStates[linkedScopeName] === undefined) {
      this._sharedStates[linkedScopeName] = initialDefaultState;
      isScopeOriginalInstance = true;
    } else {
      isScopeOriginalInstance = false;
    }

    linkedState.mlscs_setIsScopeOriginalInstance(isScopeOriginalInstance, this);

    if (this._masterLinkedStateListener) {
      // Update MasterLinkedStateListener count
      this._masterLinkedStateListener.setState({
        lenLinkedStateInstances: this._linkedStateInstances.length
      });
    }

    if (this._masterLinkedStateListener) {
      this._masterLinkedStateListener.broadcast(EVT_ADDED_LINKED_STATE, {
        linkedState,
        _rawDate: new Date(),
        _rawCallStack: new Error().stack
      });
    }

    // Set the initial default state, if the original state
    if (isScopeOriginalInstance) {
      linkedState.setState(initialDefaultState);
    }
  }

  /**
   * Unregisters the LinkedState instance with the given UUID from the master
   * controller.
   * 
   * @param {string} uuid
   */
  removeLinkedStateWithUuid(uuid) {
    this._linkedStateInstances = this._linkedStateInstances.filter((linkedState) => {
      const linkedStateUuid = linkedState.getUuid();

      return (linkedStateUuid !== uuid);
    });

    if (this._masterLinkedStateListener) {
      // Update MasterLinkedStateListener count
      this._masterLinkedStateListener.setState({
        lenLinkedStateInstances: this._linkedStateInstances.length
      });
    }
  }

  /**
   * Internally called when a LinkedState instance is updating state.
   * 
   * @param {LinkedState} linkedState LinkedState instance.
   * @param {Object} updatedStateWithMetadata TODO: Document this object
   * typedef. 
   */
  setSharedStateWithMetadata(linkedState, updatedStateWithMetadata = {}) {
    const linkedScopeName = linkedState.getLinkedScopeName();

    const { updatedState } = updatedStateWithMetadata;

    // Full state
    const nextFullSharedState = Object.assign({}, this._sharedStates[linkedScopeName], updatedState);
    
    // Set full shared state on each LinkedState instance within this scope
    this._sharedStates[linkedScopeName] = nextFullSharedState;

    // Broadcast updated state, not the updated keys
    this.broadcast(linkedState, EVT_LINKED_STATE_UPDATE, updatedState);

    if (this._masterLinkedStateListener) {
      this._masterLinkedStateListener.broadcast(EVT_UPDATED_SHARED_STATE, {
        linkedState,
        ...updatedStateWithMetadata
        // callStack: new Error().stack
      });
    }
  }

  /**
   * Retrieves the shared state for the given LinkedState's scope.
   * 
   * @param {LinkedState} linkedState
   * @return {Object} 
   */
  getSharedState(linkedState) {
    const linkedScopeName = linkedState.getLinkedScopeName();

    return this._sharedStates[linkedScopeName];
  }

  /**
   * Broadcasts an event across all LinkedState instances with the same scope.
   * 
   * @param {LinkedState} linkedState 
   * @param {string} eventName 
   * @param  {...any} args 
   */
  broadcast(linkedState, eventName, ...args) {
    const linkedScopeName = linkedState.getLinkedScopeName();

    const broadcastInstances = this.getLinkedStateInstancesByScopeName(linkedScopeName);

    broadcastInstances.forEach((instance) => {
      instance.emit(eventName, ...args);
    });
  }

  /**
   * Retrieves all LinkedState instances, regardless of scope.
   * 
   * @return {LinkedState[]}
   */
  getLinkedStateInstances() {
    return this._linkedStateInstances;
  }

  /**
   * Retrieves all LinkedState instances with the given scope name.
   * 
   * @param {string} linkedScopeName
   * @return {LinkedState[]}
   */
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