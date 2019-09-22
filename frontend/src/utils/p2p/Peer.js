import P2PSharedObject, { EVT_SHARED_UPDATE, EVT_ANY_UPDATE } from './P2PSharedObject';
import { setItem, getItem } from '../encryptedLocalStorage';
import generateId from '../string/generateId';
import Bowser from 'bowser';

export { EVT_SHARED_UPDATE };

let _localPeer = null;

export const LOCAL_PEER_STORAGE_KEY = 'LocalPeer';

export const PRIVATE_DATA_PEER_ID = 'peerId';
export const PRIVATE_DATA_KEY_IS_LOCAL_PEER = 'isLocalPeer';

export const SHARED_DATA_KEY_SYSTEM_INFO = 'systemInfo';
export const SHARED_DATA_KEY_NICKNAME = 'nickname';
export const SHARED_DATA_KEY_ABOUT_DESCRIPTION = 'aboutDescription';


/**
 * @see https://www.npmjs.com/package/bowser
 * 
 * @return {Object}
 */
const _getLocalSystemInfo = () => {
  return Bowser.parse(window.navigator.userAgent);
}

class Peer extends P2PSharedObject {
  constructor(isLocalPeer) {
    if (isLocalPeer === undefined) {
      throw new Error('isLocalPeer is not defined');
    }

    const initialPrivateData = {
      [PRIVATE_DATA_PEER_ID]: generateId(),
      [PRIVATE_DATA_KEY_IS_LOCAL_PEER]: isLocalPeer
    };

    const initialSharedData = {
      [SHARED_DATA_KEY_SYSTEM_INFO]: _getLocalSystemInfo(),
      [SHARED_DATA_KEY_NICKNAME]: null,
      [SHARED_DATA_KEY_ABOUT_DESCRIPTION]: null
    };

    super(initialPrivateData, initialSharedData);

    if (isLocalPeer && _localPeer) {
      throw new Error('_localPeer is already set');
    } else {
      _localPeer = this;
    }

    if (isLocalPeer) {
      const cachedLocalPeerData = getItem(LOCAL_PEER_STORAGE_KEY);
      if (cachedLocalPeerData) {
        const { privateData, sharedData } = cachedLocalPeerData;

        this._setPrivateData(privateData);
        this.setSharedData(sharedData);
      }

      this.on(EVT_ANY_UPDATE, () => {
        this._writeToLocalStorage();   
      });

      // Perform initial encrypted storage sync
      this._writeToLocalStorage();
    }
  }

  _writeToLocalStorage() {
    setItem(LOCAL_PEER_STORAGE_KEY, {
      privateData: this._privateData,
      sharedData: this._sharedData
    });
  }

  setNickname(nickname) {
    this.setSharedData({
      [SHARED_DATA_KEY_NICKNAME]: nickname
    });
  }

  getNickname() {
    const { [SHARED_DATA_KEY_NICKNAME]: nickname } = this._sharedData;

    return nickname;
  }

  setAboutDescription(aboutDescription) {
    this.setSharedData({
      [SHARED_DATA_KEY_ABOUT_DESCRIPTION]: aboutDescription
    });
  }

  getAboutDescription() {
    const { [SHARED_DATA_KEY_ABOUT_DESCRIPTION]: aboutDescription } = this._sharedData;

    return aboutDescription;
  }
}

const getLocalPeer = () => {
  return _localPeer;
}

export default Peer;
export {
  getLocalPeer
};