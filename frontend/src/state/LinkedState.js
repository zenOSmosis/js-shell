import EventEmitter from 'events';

// TODO: Combine these into a single unit
const linkedStateInstances = [];
const sharedStates = {};

export const DEFAULT_LINKED_SCOPE_NAME = 'default-shared';

export const EVT_BROADCAST_STATE_UPDATE = 'broadcast-state-update';

export default class LinkedState extends EventEmitter {
  constructor(linkedScopeName = DEFAULT_LINKED_SCOPE_NAME, initialDefaultState = {}) {
    super();

    this._linkedScopeName = linkedScopeName;

    if (typeof sharedStates[linkedScopeName] === 'undefined') {
      sharedStates[linkedScopeName] = initialDefaultState;
    }

    linkedStateInstances.push(this);
  }

  /**
   * Sets a common state across all shared linked state instances.
   * 
   * @param {*} updatedState 
   * @param {*} onSet
   */
  setState(updatedState = {}, onSet) {
    sharedStates[this._linkedScopeName] = Object.assign(sharedStates[this._linkedScopeName], updatedState);

    this.broadcast(EVT_BROADCAST_STATE_UPDATE, updatedState);

    if (typeof onSet === 'function') {
      onSet();
    }
  }

  /**
   * Retrieves a common state across all shared link state instances.
   */
   getState() {
    return sharedStates[this._linkedScopeName];
  }

  /**
   * Broadcasts an events across all shared linked state instances.
   * 
   * @param {*} updatedState 
   * @param {*} onSet 
   */
  broadcast(eventName, ...args) {
    const broadcastInstances = getLinkedStateInstancesByName(this._linkedScopeName);

    broadcastInstances.forEach((instance) => {
      instance.emit(eventName, ...args);
    });
  }
}

/**
 * Retrieves LinkedState instances with the given scope name.
 * 
 * @param {*} linkedScopeName 
 */
export const getLinkedStateInstancesByName = (linkedScopeName) => {
  return linkedStateInstances.filter((testInstance) => {
    if (testInstance._linkedScopeName !== linkedScopeName) {
      return false;
    }

    return true;
  });
};