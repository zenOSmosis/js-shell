import P2PSharedObject, { EVT_SHARED_UPDATE } from './P2PSharedObject';
import Bowser from 'bowser';

export { EVT_SHARED_UPDATE };

let _localPeer = null;

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

    // TODO: Remove
    this.on(EVT_SHARED_UPDATE, () => {
      console.warn({
        sharedData: this.getSharedData()
      })
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