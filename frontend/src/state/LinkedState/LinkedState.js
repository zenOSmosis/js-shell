// TODO: Add optional actions for setting individual state properties
// (e.g. (actions).setXProperty(linkedState, prevValue)) The return value from
// this action would be used to set the state property

// TODO: Add linked list for state history?

import EventEmitter from 'events';
import mlscs, { MasterLinkedStateControllerSingleton } from './_masterController';
import uuidv4 from 'uuid/v4';

// This emits when the current state scope has updated
export const EVT_LINKED_STATE_UPDATE = 'update';
// export const EVT_LINKED_STATE_WILL_UPDATE = 'willUpdate';
// export const EVT_LINKED_STATE_DID_UPDATE = 'didUpdate';

// TODO: Renamed to id(...?)
export const DEFAULT_LINKED_SCOPE_NAME = 'default-shared';

/**
 * A multi-channeled state management engine.
 * 
 * @extends EventEmitter
 */
class LinkedState extends EventEmitter {
  /**
   * @param {string} linkedScopeName The name of the shared linked scope.
   * @param {Object} initialDefaultState The default state of the instance. The
   * keys of this initial state must be utilized when updating the state, or
   * it will raise an error.
   * @param {Object} options TODO: Document these
   */
  constructor(linkedScopeName = DEFAULT_LINKED_SCOPE_NAME, initialDefaultState, options = { actions: {} }) {
    super();

    // Whether this is the original instance in the collective scope
    // LinkedState's share the same "scope" across multiple instances
    this._isScopeOriginalInstance = null; // Set to boolean later

    this._uuid = uuidv4();

    this._rawCreateDate = new Date();
    this._rawInitCallStack = new Error();

    this._linkedScopeName = linkedScopeName;

    // Important! Initial state is kept as a clone so it isn't altered
    // TODO: Move this handling to the master controller
    this._initialDefaultState = Object.freeze({
      ...{}, 
      ...initialDefaultState
    });

    this._options = options;

    // TODO: Move this handling to the master controller
    this._initialDefaultKeys = Object.keys(this._initialDefaultState);

    mlscs.addLinkedState(this, initialDefaultState);
  }

  dispatchAction(actionName, ...actionData) {
    const { actions } = this._options;
    if (!actions || typeof actions[actionName] !== 'function') {
      throw new Error(`No dispatchable action with name: ${actionName}`);
    }

    const action = actions[actionName];
    action(...actionData);
  }

  /**
   * Retrieves this particular instance's UUID.  Note, this UUID is different
   * on each reference to this LinkedState scope.
   * 
   * @return {string}
   */
  getUUID() {
    return this._uuid;
  }

  /**
   * Retrieves this class' name (e.g. "LinkedState").
   * 
   * @return {string}
   */
  getClassName() {
    const { constructor } = this;
    const { name: className } = constructor;

    return className;
  }

  /**
   * Internal, utility method which is internally called by
   * MasterLinkedStateControllerSingleton.
   * 
   * Note, this should not be directly called from this class.
   * 
   * @param {boolean} isScopeOriginalInstance 
   * @param {MasterLinkedStateControllerSingleton} mlscs
   *
   * @throws {Error} An exception is thrown if not called from
   * MasterLinkedStateControllerSingleton
   */
  mlscs_setIsScopeOriginalInstance(isScopeOriginalInstance, mlscs) {
    // Block usage from anything except MasterLinkedStateController
    if (!(mlscs instanceof MasterLinkedStateControllerSingleton)) {
      throw new Error('masterLinkedStateControllerSingleton is not an instance of MasterLinkedStateControllerSingleton');
    }

    this._isScopeOriginalInstance = isScopeOriginalInstance;
  }

  /**
   * Returns boolean true if this LinkedState instance is the original in its scope.
   * 
   * @return {boolean}
   */
  getIsScopeOriginalInstance() {
    return this._isScopeOriginalInstance;
  }

  /**
   * @return {string}
   */
  getLinkedScopeName() {
    return this._linkedScopeName;
  }

  /**
   * @return {Date}
   */
  getCreateDate() {
    return this._rawCreateDate;
  }

  /**
   * Sets a common state across all LinkedState instances with the same scope.
   * 
   * @param {Object} updatedState 
   * @param {function} onSet? Optional callback to be performed after state has
   * been updated.
   * @throws {Error} If trying to set a key in the updatedState which is not
   * present in the initial state, an error will be thrown.
   */
  setState(updatedState = {}, onSet = null) {
    // TODO: Move this handling to the master controller
    for (let updatedKey of Object.keys(updatedState)) {
      if (this._initialDefaultKeys.indexOf(updatedKey) === -1) {
        throw new Error(`Updated key "${updatedKey}" is not present in initial keys`);
      }
    }

    mlscs.setSharedState(this, {
      updatedState,
      meta: {
        rawDate: new Date(),
        rawCallStack: new Error()
      }
    });

    // TODO: Send callback through mlscs
    if (typeof onSet === 'function') {
      onSet();
    }

    // Post-set event hook
    // this.emit(EVT_LINKED_STATE_DID_UPDATE, prevState);
  }

  /**
   * Retrieves a common state across all shared link state instances.
   * 
   * @return {Object}
   */
  getState() {
    // return sharedStates[this._linkedScopeName];
    return mlscs.getSharedState(this);
  }

  /**
   * Broadcasts an events across all shared linked state instances.
   * 
   * @param {string} eventName 
   * @param {any} args
   */
  broadcast(eventName, ...args) {
    mlscs.broadcast(this, eventName, ...args);
  }

  /**
   * Resets the state to the initial default state.
   */
  reset() {
    console.error(this._initialDefaultState);

    this.setState(this._initialDefaultState);
  }

  /**
   * Destroys this LinkedState instance, but not other LinkedState instances
   * within the same scope.
   */
  destroy() {
    // Remove all event listeners
    // @see https://nodejs.org/api/events.html#events_emitter_removealllisteners_eventname
    this.removeAllListeners();

    mlscs.removeLinkedStateWithUUID(this._uuid);
  }

  /**
   * Alias of this.destroy().
   */
  exit() {
    this.destroy();
  }
}

export default LinkedState;