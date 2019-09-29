import P2PSharedObject, {
  EVT_SHARED_UPDATE,
  EVT_ANY_UPDATE
} from './P2PSharedObject.class';

import P2PLinkedState, {
  ACTION_ADD_REMOTE_PEER,
  ACTION_REMOVE_REMOTE_PEER_WITH_ID,
  ACTION_NOTIFY_PEER_UPDATE,

  STATE_REMOTE_PEERS
} from 'state/P2PLinkedState';

import generateId from '../string/generateId';
import Bowser from 'bowser';

export { EVT_SHARED_UPDATE, EVT_ANY_UPDATE };

let _localUser = null;

export const SHARED_DATA_KEY_PEER_ID = 'userId';
export const SHARED_DATA_KEY_SYSTEM_INFO = 'systemInfo';
export const SHARED_DATA_KEY_NICKNAME = 'nickname';
export const SHARED_DATA_KEY_ABOUT_DESCRIPTION = 'aboutDescription';

const _p2pLinkedState = new P2PLinkedState();

/**
 * @see https://www.npmjs.com/package/bowser
 * 
 * @return {Object}
 */
const _getLocalSystemInfo = () => {
  return Bowser.parse(window.navigator.userAgent);
}

class Peer extends P2PSharedObject {

  // TODO: Rename to createFromSharedData
  static createFromRawData = (rawData) => {
    const { [SHARED_DATA_KEY_PEER_ID]: userId } = rawData;

    let peer = getPeerWithId(userId);
    if (!peer || !peer.getIsConnected()) {
      peer = new Peer(false);
    }
  
    // Map raw user object to Peer object
    peer.setSharedData(rawData);

    return peer;
  };

  constructor(isLocalUser = false) {
    const initialSharedData = {
      [SHARED_DATA_KEY_PEER_ID]: (isLocalUser ? generateId() : null),
      [SHARED_DATA_KEY_SYSTEM_INFO]: _getLocalSystemInfo(),
      [SHARED_DATA_KEY_NICKNAME]: null,
      [SHARED_DATA_KEY_ABOUT_DESCRIPTION]: null
    };
    
    const initialPrivateData = {};

    super(initialSharedData, initialPrivateData);

    this._isLocalUser = isLocalUser;

    if (!this._isLocalUser) {
      _p2pLinkedState.dispatchAction(ACTION_ADD_REMOTE_PEER, this);
    }

    this._isConnected = true;

    if (this._isLocalUser) {
      if (_localUser) {
        // Enforce only one local peer
        throw new Error('_localUser is already set');
      } else {
        _localUser = this;
      }
    }
  }

  setSharedData(sharedData) {
    super.setSharedData(sharedData);

    _p2pLinkedState.dispatchAction(ACTION_NOTIFY_PEER_UPDATE, this);
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
    return this._isLocalUser;
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

  getIsConnected() {
    return this._isConnected;
  }

  disconnect() {
    if (this._isLocalUser) {
      console.error('Cannot disconnect local user');
    } else {
      this._isConnected = true;

      _p2pLinkedState.dispatchAction(ACTION_REMOVE_REMOTE_PEER_WITH_ID, this.getPeerId());
    }
  }
}

export default Peer;

export const getLocalUser = () => {
  return _localUser;
};

export const getLocalUserId = () => {
  if (!_localUser) {
    return;
  } else {
    return _localUser.getPeerId();
  }
};

export const getPeerWithId = (peerId) => {
  const { [STATE_REMOTE_PEERS]: remotePeers } = _p2pLinkedState.getState();
  
  const allPeers = [_localUser, ...remotePeers];
  const lenPeers = allPeers.length;

  for (let i = 0; i < lenPeers; i++) {
    const testPeer = allPeers[i];
    const testPeerId = testPeer.getPeerId();

    if (peerId === testPeerId) {
      return testPeer;
    }
  }
};