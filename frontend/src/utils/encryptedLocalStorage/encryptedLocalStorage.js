import EncryptedLocalStorage from './EncryptedLocalStorage.class';

const encryptedLocalStorage = new EncryptedLocalStorage();

export const setItem = (...args) => encryptedLocalStorage.setItem(...args);
export const getItem = (...args) => encryptedLocalStorage.getItem(...args);
export const removeItem = (...args) => encryptedLocalStorage.removeItem(...args);
export const removeAll = (...args) => encryptedLocalStorage.removeAll(...args);
export const clear = (...args) => encryptedLocalStorage.clear(...args);
export const getAllKeys = (...args) => encryptedLocalStorage.getAllKeys(...args);

export default encryptedLocalStorage;