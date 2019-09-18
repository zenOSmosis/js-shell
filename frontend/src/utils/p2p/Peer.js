import P2PSharedObject, { EVT_SHARED_UPDATE } from './P2PSharedObject';
import Bowser from 'bowser';

export { EVT_SHARED_UPDATE };

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
    const initialPrivateData = {
      isLocalPeer
    };

    const initialSharedData = {
      systemInfo: _getLocalSystemInfo()
    };

    super(initialPrivateData, initialSharedData);

    if (isLocalPeer === undefined) {
      throw new Error('isLocalPeer is not defined');
    }

    console.warn('TODO: Handle local Peer', {
      sharedData: this._sharedData
    });
  }
}

export default Peer;