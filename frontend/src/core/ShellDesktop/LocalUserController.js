import ClientProcess, { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import LocalUser from 'utils/localUser/LocalUser.class';
import { openAuthenticate } from 'utils/socket.io';

class LocalUserController extends ClientProcess {
  constructor(...args) {
    super(...args);

    this.setTitle('Local User Controller');

    this._localUser = new LocalUser();
    const userId = this._localUser.getPeerId();
    
    this.on(EVT_BEFORE_EXIT, () => {
      this._localUser.destroy();

      this._localUser = null;
    });

    // Open Socket.io connection
    openAuthenticate({
      userId
    });
  }
}

export default LocalUserController;