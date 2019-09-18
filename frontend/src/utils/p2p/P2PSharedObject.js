import EventEmitter from 'events';

export const EVT_SHARED_UPDATE = 'sharedUpdate';

class P2PSharedObject extends EventEmitter {
  constructor(initialPrivateData, initialSharedData = {}) {
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
  }

  /**
   * @return {Object}
   */
  getSharedData() {
    return this._sharedData;
  }

  /**
   * 
   * @param {Object} params 
   */
  _setPrivateData(params) {
    this._privateData = { ...this._privateData, ...params };
  }

  destroy() {
    this.removeAllListeners();

    this._sharedData = {};
    this._privateData = {};
  }
}

export default P2PSharedObject;