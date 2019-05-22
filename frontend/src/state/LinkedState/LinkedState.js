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
  _isScopeOriginalInstance = false;

  constructor(linkedScopeName = DEFAULT_LINKED_SCOPE_NAME, initialDefaultState = {}) {
    super();

    this._uuid = uuidv4();

    this._rawCreateDate = new Date();
    this._rawInitCallStack = new Error();

    this._linkedScopeName = linkedScopeName;

    mlscs.addLinkedState(this, initialDefaultState);
  }

  getUUID() {
    return this._uuid;
  }

  getClassName() {
    const { constructor } = this;
    const { name: className } = constructor;

    return className;
  }

  /**
   * This method is only inteneded to be utilized by the
   * MasterLinkedStateController, and not directly set within this
   * class.
   * 
   * @param {boolean} isScopeOriginalInstance 
   * @param {MasterLinkedStateControllerSingleton} mlscs 
   */
  setIsScopeOriginalInstance(isScopeOriginalInstance, mlscs) {
    // Block usage from anything except MasterLinkedStateController
    if (!(mlscs instanceof MasterLinkedStateControllerSingleton)) {
      throw new Error('masterLinkedStateControllerSingleton is not an instance of MasterLinkedStateControllerSingleton');
    }

    this._isScopeOriginalInstance = isScopeOriginalInstance;
  }

  getIsScopeOriginalInstance() {
    return this._isScopeOriginalInstance;
  }

  getLinkedScopeName() {
    return this._linkedScopeName;
  }

  getCreateDate() {
    return this._rawCreateDate;
  }

  /**
   * Sets a common state across all shared LinkedState instances.
   * 
   * @param {object} updatedState 
   * @param {function} onSet [default = null] Optional callback to be
   * performed after state has been updated
   */
  setState(updatedState = {}, onSet = null) {
    // const prevState = this.getState();

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

    // this.emit(EVT_LINKED_STATE_DID_UPDATE, prevState);
  }

  /**
   * Retrieves a common state across all shared link state instances.
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

  destroy() {
    // Remove all event listeners
    // @see https://nodejs.org/api/events.html#events_emitter_removealllisteners_eventname
    this.removeAllListeners();

    mlscs.removeLinkedStateWithUUID(this._uuid);
  }
}