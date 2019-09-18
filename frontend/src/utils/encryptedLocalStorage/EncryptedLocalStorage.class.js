import generateID from '../string/generateID';
import SecureLS from 'secure-ls';
import EncryptedLocalStorageLinkedState, {
  ACTION_HANDLE_STORAGE_UPDATE
} from 'state/EncryptedLocalStorageLinkedState';

class EncryptedLocalStorage {
  static getEncryptionSecret() {
    const localStorage = window.localStorage;

    const encodedMasterKey = btoa('__/__');

    let cachedSecretKey = localStorage.getItem(encodedMasterKey);
    if (!cachedSecretKey) {
      cachedSecretKey = generateID(128);
      localStorage.setItem(encodedMasterKey, cachedSecretKey);
    }

    return cachedSecretKey;
  }

  constructor() {
    this._ls = new SecureLS({
      encodingType: 'aes',
      isCompression: true,
      encryptionSecret: EncryptedLocalStorage.getEncryptionSecret()
    });

    this._linkedState = new EncryptedLocalStorageLinkedState();
  }

  /**
   * @param {string} key 
   * @param {any} data 
   */
  setItem(key, data) {
    this._ls.set(btoa(key), data);

    this._linkedState.dispatchAction(ACTION_HANDLE_STORAGE_UPDATE);
  }

  /**
   * @param {string} key
   */
  getItem(key) {
    return this._ls.get(btoa(key));
  }

  /**
   * @param {string} key 
   */
  removeItem(key) {
    this._ls.remove(btoa(key));

    this._linkedState.dispatchAction(ACTION_HANDLE_STORAGE_UPDATE);
  }

  removeAll() {
    this._ls.removeAll();

    this._linkedState.dispatchAction(ACTION_HANDLE_STORAGE_UPDATE);
  }

  clear() {
    this._ls.clear();

    this._linkedState.dispatchAction(ACTION_HANDLE_STORAGE_UPDATE);
  }

  /**
   * @return {string[]}
   */
  getAllKeys() {
    return this._ls.getAllKeys().map(key => {
      return atob(key);
    });
  }
}

export default EncryptedLocalStorage;