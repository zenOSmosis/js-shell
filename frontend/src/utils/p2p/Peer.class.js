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
import WebRTCPeer, {
  EVT_CONNECT_IN_PROGRESS as EVT_WEB_RTC_CONNECT_IN_PROGRESS,
  EVT_CONNECT as EVT_WEB_RTC_CONNECT,
  // EVT_DATA as EVT_WEB_RTC_DATA,
  EVT_STREAM as EVT_WEB_RTC_STREAM,
  EVT_CONNECT_ERROR as EVT_WEB_RTC_CONNECT_ERROR,
  EVT_DISCONNECT as EVT_WEB_RTC_DISCONNECT
} from './WebRTCPeer.class';
import generateId from '../string/generateId';
import Bowser from 'bowser';

// P2PSharedObject events
export { EVT_SHARED_UPDATE, EVT_ANY_UPDATE };

export const SHARED_DATA_KEY_USER_ID = 'userId';
export const SHARED_DATA_KEY_SYSTEM_INFO = 'systemInfo';
export const SHARED_DATA_KEY_NICKNAME = 'nickname';
export const SHARED_DATA_KEY_ABOUT_DESCRIPTION = 'aboutDescription';

export const PRIVATE_DATA_WEB_RTC_LAST_CONNECT_STATUS_UPDATE_TIME = 'webRTCLastUpdateTime';
export const PRIVATE_DATA_KEY_WEB_RTC_MEDIA_STREAMS = 'webRTCMediaStreams';

let _localUser = null;
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
    const { [SHARED_DATA_KEY_USER_ID]: userId } = rawData;

    let peer = Peer.getPeerWithId(userId);
    if (!peer) {
      peer = new Peer(false);
    }
  
    // Map raw user object to Peer object
    peer.setSharedData(rawData);

    return peer;
  };

  /**
   * @return {Peer}
   */
  static getPeerWithId = (peerId) => {
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

  constructor(isLocalUser = false) {
    const initialSharedData = {
      [SHARED_DATA_KEY_USER_ID]: (isLocalUser ? generateId() : null),
      [SHARED_DATA_KEY_SYSTEM_INFO]: _getLocalSystemInfo(),
      [SHARED_DATA_KEY_NICKNAME]: null,
      [SHARED_DATA_KEY_ABOUT_DESCRIPTION]: null
    };
    
    const initialPrivateData = {
      [PRIVATE_DATA_WEB_RTC_LAST_CONNECT_STATUS_UPDATE_TIME]: null,
      [PRIVATE_DATA_KEY_WEB_RTC_MEDIA_STREAMS]: []
    };

    super(initialSharedData, initialPrivateData);

    this._isLocalUser = isLocalUser;

    if (!this._isLocalUser) {
      _p2pLinkedState.dispatchAction(ACTION_ADD_REMOTE_PEER, this);
    }

    this._isOnline = null;

    this._webRTCPeer = null;

    if (this._isLocalUser) {
      // TODO: Enforce that this originated from LocalUser class

      if (_localUser) {
        // Enforce only one local peer
        throw new Error('_localUser is already set');
      } else {
        _localUser = this;
      }
    }

    this.on(EVT_ANY_UPDATE, () => {
      _p2pLinkedState.dispatchAction(ACTION_NOTIFY_PEER_UPDATE, this);
    });
  }

  /**
   * @return {Object}
   */
  getSystemInfo() {
    const { [SHARED_DATA_KEY_SYSTEM_INFO]: systemInfo } = this._sharedData;

    return systemInfo;
  }

  /**
   * Returns a simple description of "browserName on osName."
   * 
   * @return {string}
   */
  getBrowserOnOs() {
    const systemInfo = this.getSystemInfo();

    if (systemInfo) {
      const {
        browser: {
          name: browserName
        }, os: {
          name: osName
        }
      } = systemInfo;

      return `${browserName} on ${osName}`;
    }
  }
  /**
   * @return {string}
   */
  getPeerId() {
    const { [SHARED_DATA_KEY_USER_ID]: peerId } = this._sharedData;

    return peerId;
  }

  /**
   * @return {boolean}
   */
  getIsLocalUser() {
    return this._isLocalUser;
  }

  /**
   * @param {string} nickname 
   */
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

  /**
   * @param {string} aboutDescription 
   */
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

    /**
   * TODO: Rename to mountWebRTCPeer
   * 
   * @param {WebRTCPeer} webRTCPeer 
   */
  setWebRTCPeer(webRTCPeer) {
    if (this._isLocalUser) {
      throw new Error('LocalUser cannot directly set WebRTCPeer');
    }
    
    if (this._webRTCPeer) {
      throw new Error('Peer already has a WebRTCPeer instance');
    }

    if (!(webRTCPeer instanceof WebRTCPeer)) {
      throw new TypeError('webRTCPeer should be of WebRTCPeer type');
    }

    this._webRTCPeer = webRTCPeer;

    const _setLastUpdateTime = () => {
      this._setPrivateData({
        [PRIVATE_DATA_WEB_RTC_LAST_CONNECT_STATUS_UPDATE_TIME]: new Date()
      });
    };

    this._webRTCPeer.on(EVT_WEB_RTC_CONNECT_IN_PROGRESS, _setLastUpdateTime);
    this._webRTCPeer.on(EVT_WEB_RTC_CONNECT, _setLastUpdateTime);
    this._webRTCPeer.on(EVT_WEB_RTC_CONNECT_ERROR, _setLastUpdateTime);

    // Prototype stream handling
    this._webRTCPeer.on(EVT_WEB_RTC_STREAM, (mediaStream) => {
      this._addWebRTCMediaStream(mediaStream);
    });

    this._webRTCPeer.on(EVT_WEB_RTC_DISCONNECT, () => {
      // Clear all WebRTC media streams
      this._setWebRTCMediaStreams([]);
    });
  }

  /**
   * @return {WebRTCPeer}
   */
  getWebRTCPeer() {
    return this._webRTCPeer;
  }

  /**
   * @param {MediaStream} mediaStream 
   */
  _addWebRTCMediaStream(mediaStream) {
    if (this._isLocalUser) {
      throw new Error('_addWebRTCMediaStream is only available for remote peers');
    }

    // Add mediaStream to privateData mediaStream
    const { [PRIVATE_DATA_KEY_WEB_RTC_MEDIA_STREAMS]: mediaStreams } = this._privateData;
    mediaStreams.push(mediaStream);
    this._setPrivateData({
      [PRIVATE_DATA_KEY_WEB_RTC_MEDIA_STREAMS]: mediaStreams
    });
  }

  /**
   * @param {MediaStream[]} mediaStreams 
   */
  _setWebRTCMediaStreams(mediaStreams) {
    this._setPrivateData({
      [PRIVATE_DATA_KEY_WEB_RTC_MEDIA_STREAMS]: mediaStreams
    });
  }

  /**
   * @return {MediaStream[]}
   */
  getWebRTCMediaStreams() {
    if (this._isLocalUser) {
      throw new Error('getWebRTCMediaStreams is only available for remote peers');
    }

    const { [PRIVATE_DATA_KEY_WEB_RTC_MEDIA_STREAMS]: mediaStreams } = this._privateData;

    return mediaStreams;
  }

  /**
   * @return {boolean}
   */
  getIsWebRTCConnecting() {
    if (!this._webRTCPeer) {
      return;
    }

    return this._webRTCPeer.getIsConnecting();
  }

  /**
   * @return {boolean}
   */
  getIsWebRTCConnected() {
    if (!this._webRTCPeer) {
      return;
    }

    return this._webRTCPeer.getIsOnline();
  }

  /**
   * @return {Error}
   */
  getWebRTCConnectError() {
    if (!this._webRTCPeer) {
      return;
    }

    return this._webRTCPeer.getConnectError();
  }

  /**
   * TODO: Limit setting ability to P2PController
   * 
   * @return {Promise<void>}
   */
  async setIsOnline(isOnline) {
    try {
      this._isOnline = isOnline;

      if (!this._isOnline && this._webRTCPeer) {
        await this._webRTCPeer.disconnect();
      }
    } catch (exc) {
      console.error(exc);
    }
  }

  /**
   * TODO: Rename to getIsSocketConnected
   * 
   * @return {boolean}
   */
  getIsOnline() {
    return this._isOnline;
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