import P2PSharedObject, { EVT_SHARED_UPDATE, EVT_ANY_UPDATE } from './P2PSharedObject.class';

import generateId from '../string/generateId';
import Bowser from 'bowser';

export { EVT_SHARED_UPDATE, EVT_ANY_UPDATE };

let _localPeer = null;

export const SHARED_DATA_KEY_PEER_ID = 'userId';
export const SHARED_DATA_KEY_SYSTEM_INFO = 'systemInfo';
export const SHARED_DATA_KEY_NICKNAME = 'nickname';
export const SHARED_DATA_KEY_ABOUT_DESCRIPTION = 'aboutDescription';

export const PRIVATE_DATA_KEY_IS_LOCAL_PEER = 'isLocalPeer';

/**
 * @see https://www.npmjs.com/package/bowser
 * 
 * @return {Object}
 */
const _getLocalSystemInfo = () => {
  return Bowser.parse(window.navigator.userAgent);
}

const _peers = [];

class Peer extends P2PSharedObject {
  static createFromRawData = (rawData) => {
    const { peerId } = rawData;

    let peer = getPeerWithId(peerId);
    if (!peer) {
      peer = new Peer(false);
    }
  
    // Map raw user object to Peer object
    peer.setSharedData(rawData);

    return peer;
  };

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

    if (isLocalPeer) {
      if (_localPeer) {
        // Enforce only one local peer
        throw new Error('_localPeer is already set');
      } else {
        _localPeer = this;
      }
    }

    _peers.push(this);
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

export default Peer;

export const getLocalPeer = () => {
  return _localPeer;
};

export const getLocalPeerId = () => {
  if (!_localPeer) {
    return;
  } else {
    return _localPeer.getPeerId();
  }
};

export const getPeerWithId = (peerId) => {
  const lenPeers = _peers.length;

  for (let i = 0; i < lenPeers; i++) {
    const testPeer = _peers[i];
    const testPeerId = testPeer.getPeerId();

    if (peerId === testPeerId) {
      return testPeer;
    }
  }
};