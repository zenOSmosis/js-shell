import Peer, {
  EVT_ANY_UPDATE
} from '../p2p/Peer.class.js';
import { setItem, getItem } from '../encryptedLocalStorage';
import { socketAPIQuery } from '../socketAPI';
import { SOCKET_API_ROUTE_SET_USER_DATA } from '../../shared/socketAPI/socketAPIRoutes';

export const LOCAL_USER_STORAGE_KEY = 'LocalUser';

class LocalUser extends Peer {
  constructor() {
    super(true);

    const cachedLocalUserData = getItem(LOCAL_USER_STORAGE_KEY);
    if (cachedLocalUserData) {
      const { privateData, sharedData } = cachedLocalUserData;

      this._setPrivateData(privateData);
      this.setSharedData(sharedData);
    }

    this.on(EVT_ANY_UPDATE, () => {
      this._write();
    });

    // Perform initial sync
    this._write();
  }

  /**
   * Writes locally and to remote db / peers.
   */
  async _write() {
    try {
      const privateData = this._privateData;
      const sharedData = this._sharedData;

      // Write to local storage
      setItem(LOCAL_USER_STORAGE_KEY, {
        privateData,
        sharedData
      });

      await this._writeRemote();
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Writes to remote db / peers.
   */
  async _writeRemote() {
    try {
      const sharedData = this._sharedData;
      const privateData = this._privateData;

      // Write to remote
      await socketAPIQuery(SOCKET_API_ROUTE_SET_USER_DATA, {
        sharedData,
        privateData
      });
    } catch (exc) {
      throw exc;
    }
  }
}

export default LocalUser;