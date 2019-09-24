import P2PSharedObject, { EVT_SHARED_UPDATE, EVT_ANY_UPDATE } from './P2PSharedObject.class';
import { setItem, getItem } from '../encryptedLocalStorage';
import generateId from '../string/generateId';
import Bowser from 'bowser';
import { socketAPIQuery } from '../socketAPI';
import { SOCKET_API_ROUTE_SET_USER_DATA } from '../../shared/socketAPI/socketAPIRoutes';

export { EVT_SHARED_UPDATE };

let _localPeer = null;

export const LOCAL_PEER_STORAGE_KEY = 'LocalPeer';

export const SHARED_DATA_KEY_PEER_ID = 'userId';
export const SHARED_DATA_KEY_SYSTEM_INFO = 'systemInfo';
export const SHARED_DATA_KEY_NICKNAME = 'nickname';
export const SHARED_DATA_KEY_ABOUT_DESCRIPTION = 'aboutDescription';

export const PRIVATE_DATA_KEY_IS_LOCAL_PEER = 'isLocalPeer'

/**
 * @see https://www.npmjs.com/package/bowser
 * 
 * @return {Object}
 */
const _getLocalSystemInfo = () => {
  return Bowser.parse(window.navigator.userAgent);
}

class Peer extends P2PSharedObject {
  constructor(isLocalPeer = false) {
    const initialSharedData = {
      [SHARED_DATA_KEY_PEER_ID]: (isLocalPeer ? generateId() : null),
      [SHARED_DATA_KEY_SYSTEM_INFO]: _getLocalSystemInfo(),
      [SHARED_DATA_KEY_NICKNAME]: null,
      [SHARED_DATA_KEY_ABOUT_DESCRIPTION]: null
    };
    
    const initialPrivateData = {
      [PRIVATE_DATA_KEY_IS_LOCAL_PEER]: isLocalPeer
    };

    super(initialSharedData, initialPrivateData);

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
        this._write();
      });

      // Perform initial encrypted storage sync
      this._write();
    }
  }

  // TODO: Block this if not the local peer
  async _write() {
    try {
      const privateData = this._privateData;
      const sharedData = this._sharedData;

      // Write to local storage
      setItem(LOCAL_PEER_STORAGE_KEY, {
        privateData,
        sharedData
      });

      // Write to remote storage
      await socketAPIQuery(SOCKET_API_ROUTE_SET_USER_DATA, {
        privateData,
        sharedData
      });
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * @return {string}
   */
  getPeerId() {
    const { [SHARED_DATA_KEY_PEER_ID]: peerId } = this._sharedData;

    return peerId;
  }

  /**
   * @return {boolean}
   */
  getIsLocalUser() {
    const { [PRIVATE_DATA_KEY_IS_LOCAL_PEER]: isLocalUser } = this._privateData;

    return isLocalUser;
  }

  setNickname(nickname) {
    this.setSharedData({
      [SHARED_DATA_KEY_NICKNAME]: nickname
    });
  }

  /**
   * @return {string}
   */
  getNickname() {
    const { [SHARED_DATA_KEY_NICKNAME]: nickname } = this._sharedData;

    return nickname;
  }

  setAboutDescription(aboutDescription) {
    this.setSharedData({
      [SHARED_DATA_KEY_ABOUT_DESCRIPTION]: aboutDescription
    });
  }

  /**
   * @return {string}
   */
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