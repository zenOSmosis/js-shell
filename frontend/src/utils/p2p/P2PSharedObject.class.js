// TODO: Create local private data which won't be sent over wire

import EventEmitter from 'events';

export const EVT_SHARED_UPDATE = 'sharedUpdate';
export const EVT_PRIVATE_UPDATE = 'privateUpdate';
export const EVT_ANY_UPDATE = 'anyUpdate';

class P2PSharedObject extends EventEmitter {
  constructor(initialSharedData, initialPrivateData = {}) {
    super();

    this._sharedData = Object.seal(initialSharedData);
    this._privateData = Object.seal(initialPrivateData);

    // See emit() for usage
    this._eventAnyUpdateDebounceTimeout = null;
  }

  /**
   * @param {Object} params 
   */
  setSharedData(params) {
    this._sharedData = { ...this._sharedData, ...params };

    this.emit(EVT_SHARED_UPDATE);
    this.emit(EVT_ANY_UPDATE);
  }

  emit(eventName, eventData = null) {
    // Prevent double-firing on EVT_ANY_UPDATE, due to this event being
    // emitted twice on shared/private update multi-sets
    // Note: The debounce method is not used for a wrapper here so that
    // non-EVT_ANY_UPDATE events will still pass through w/o debouncing
    if (eventName === EVT_ANY_UPDATE) {
      clearTimeout(this._eventAnyUpdateDebounceTimeout);

      this._eventAnyUpdateDebounceTimeout = setTimeout(() => {
        super.emit(EVT_ANY_UPDATE);
      }, 0);
    } else {
      super.emit(eventName, eventData);
    }
  }

  /**
   * @return {Object}
   */
  getSharedData() {
    return this._sharedData;
  }

  /**
   * @param {Object} params 
   */
  _setPrivateData(params) {
    this._privateData = { ...this._privateData, ...params };

    this.emit(EVT_PRIVATE_UPDATE);
    this.emit(EVT_ANY_UPDATE);
  }

  destroy() {
    this._sharedData = {};
    this._privateData = {};

    this.emit(EVT_PRIVATE_UPDATE);
    this.emit(EVT_SHARED_UPDATE);
    this.emit(EVT_ANY_UPDATE);

    this.removeAllListeners();
  }
}

export default P2PSharedObject;