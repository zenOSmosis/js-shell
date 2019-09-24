import EventEmitter from 'events';

export const EVT_SHARED_UPDATE = 'sharedUpdate';
export const EVT_PRIVATE_UPDATE = 'privateUpdate';
export const EVT_ANY_UPDATE = 'anyUpdate';

class P2PSharedObject extends EventEmitter {
  constructor(initialSharedData, initialPrivateData = {}) {
    super();

    this._sharedData = initialSharedData;
    this._privateData = initialPrivateData;
  }

  /**
   * @param {Object} params 
   */
  setSharedData(params) {
    this._sharedData = { ...this._sharedData, ...params };

    this.emit(EVT_SHARED_UPDATE);
    this.emit(EVT_ANY_UPDATE);
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