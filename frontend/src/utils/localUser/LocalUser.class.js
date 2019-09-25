import Peer, {
  EVT_ANY_UPDATE
} from '../p2p/Peer.class.js';
import { setItem, getItem } from '../encryptedLocalStorage';
import { socketAPIQuery } from '../socketAPI';
import { SOCKET_API_ROUTE_SET_USER_DATA } from '../../shared/socketAPI/socketAPIRoutes';

// TODO: Rename to LOCAL_USER_STORAGE_KEY
export const LOCAL_PEER_STORAGE_KEY = 'LocalPeer';

class LocalUser extends Peer {
  constructor() {
    super(true);

    const cachedLocalPeerData = getItem(LOCAL_PEER_STORAGE_KEY);
    if (cachedLocalPeerData) {
      const { privateData, sharedData } = cachedLocalPeerData;

      this._setPrivateData(privateData);
      this.setSharedData(sharedData);
    }

    this.on(EVT_ANY_UPDATE, () => {
      this._write();
    });
  }

  async writeRemote() {
    try {
      const sharedData = this._sharedData;

      // Write to remote
      await socketAPIQuery(SOCKET_API_ROUTE_SET_USER_DATA, {
        ...sharedData
      });
    } catch (exc) {
      throw exc;
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

      await this.writeRemote();
    } catch (exc) {
      throw exc;
    }
  }
}

export default LocalUser;