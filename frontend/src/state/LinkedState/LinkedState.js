import EventEmitter from 'events';
import mlscs, {MasterLinkedStateControllerSingleton} from './controller/MasterLinkedStateController';
// import MasterLinkedStateListener from './MasterLinkedStateListener';
import uuidv4 from 'uuid/v4';

// TODO: Add linked list for state history?

// This emits when the current state scope has updated
export const EVT_LINKED_STATE_UPDATE = 'update';
// export const EVT_LINKED_STATE_WILL_UPDATE = 'will-update';
// export const EVT_LINKED_STATE_DID_UPDATE = 'did-update';

// TODO: Renamed to id(...?)
export const DEFAULT_LINKED_SCOPE_NAME = 'default-shared';

export default class LinkedState extends EventEmitter {
  constructor(linkedScopeName = DEFAULT_LINKED_SCOPE_NAME, initialDefaultState = {}) {
    super();

    // Whether this is the original instance in the collective scope
    // LinkedState's share the same "scope" across multiple instances
    this._isScopeOriginalInstance = null; // Set to boolean later

    this._uuid = uuidv4();

    this._rawCreateDate = new Date();
    this._rawInitCallStack = new Error();

    this._linkedScopeName = linkedScopeName;

    mlscs.addLinkedState(this, initialDefaultState);

    this._initialDefaultState = initialDefaultState;

    // this.setState(initialDefaultState);
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
   * Sets a common state across all shared LinkedState instances.
   * 
   * @param {object} updatedState 
   * @param {Function} onSet [default = null] Optional callback to be
   * performed after state has been updated
   */
  setState(updatedState = {}, onSet = null) {
    // const prevState = this.getState();

    // Pre-set event hook
    // this.emit(EVT_LINKED_STATE_WILL_UPDATE, prevState);

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
   * @return {object}
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
  kill() {
    this.destroy();
  }
}