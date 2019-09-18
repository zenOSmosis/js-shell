import LinkedState from './LinkedState';

export const STATE_LAST_UPDATE_TIME = 'lastUpdateTime';

export const ACTION_HANDLE_STORAGE_UPDATE = 'handleStorageUpdate';

class EncryptedLocalStorageLinkedState extends LinkedState {
  constructor() {
    super('encrypted-local-storage', {
      [STATE_LAST_UPDATE_TIME]: null
    }, {
      actions: {
        [ACTION_HANDLE_STORAGE_UPDATE]: () => {
          this.setState({
            [STATE_LAST_UPDATE_TIME]: new Date()
          });
        }
      }
    });

    // Perform initial sync w/ any listeners
    this.dispatchAction(ACTION_HANDLE_STORAGE_UPDATE);
  }
}

export default EncryptedLocalStorageLinkedState;