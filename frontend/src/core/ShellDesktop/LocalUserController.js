import ClientProcess, { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import LocalUser from 'utils/localUser/LocalUser.class';
import socketIO, {
  openAuthenticate,
  EVT_SOCKET_CONNECT,
  EVT_SOCKET_DISCONNECT
} from 'utils/socket.io';

class LocalUserController extends ClientProcess {
  constructor(...args) {
    super(...args);

    this.setTitle('Local User Controller');

    this._localUser = new LocalUser();
    const userId = this._localUser.getPeerId();

    this._handleSocketConnect = this._handleSocketConnect.bind(this);
    this._handleSocketDisconnect = this._handleSocketDisconnect.bind(this);

    socketIO.on(EVT_SOCKET_CONNECT, this._handleSocketConnect);
    socketIO.on(EVT_SOCKET_DISCONNECT, this._handleSocketDisconnect);
    
    this.on(EVT_BEFORE_EXIT, () => {
      // Stop socketIO connection when LocalUserController is stopped
      socketIO.close();

      socketIO.off(EVT_SOCKET_CONNECT, this._handleSocketConnect);
      socketIO.off(EVT_SOCKET_DISCONNECT, this._handleSocketDisconnect);

      this._localUser.destroy();
      this._localUser = null;
    });

    // Open Socket.io connection
    openAuthenticate({
      userId
    });
  }

  _handleSocketConnect() {
    this._localUser.setIsOnline(true);
  }

  _handleSocketDisconnect() {
    this._localUser.setIsOnline(false);
  }
}

export default LocalUserController;