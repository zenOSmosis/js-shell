import ClientProcess, { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import socket, { EVT_SOCKET_CONNECT } from 'utils/socket.io';
import fetchSocketPeerIds from 'utils/p2p/socketPeer/fetchSocketPeerIds';
import P2PLinkedState from 'state/P2PLinkedState';
import {
  SOCKET_API_EVT_PEER_CONNECT,
  SOCKET_API_EVT_PEER_DISCONNECT,
  SOCKET_API_EVT_PEER_DATA
} from 'shared/socketAPI/socketAPIEvents';
import {
  _handleSocketPeerConnectionStatusUpdate,
  _handleReceivedSocketPeerDataPacket
 } from 'utils/p2p/socketPeer';

/**
 * Listens to P2P actions and bind them to P2PLinkedState.
 * 
 * @extends ClientProcess
 */
class P2PController extends ClientProcess {
  constructor(...args) {
    super(...args);

    this._p2pLinkedState = null;
    this._hasInitialSocketPeerSync = false;
  };

  async _init() {
    try {
      this.setTitle('P2P Controller');

      // Note: Destructor for this is found in _initSocketIOServices
      this._p2pLinkedState = new P2PLinkedState();

      this.on(EVT_BEFORE_EXIT, () => {
        // Reset so that any UI views / etc. don't show connected peers
        this._p2pLinkedState.reset();

        // Unlink P2PLinkedState
        this._p2pLinkedState.destroy();
        this._p2pLinkedState = null;
      });

      console.debug('Initializing Socket.io peer connections');
      await this._initSocketIOServices();

      console.debug('Initialzing WebRTC services');
      await this._initWebRTCServices();

      await super._init();

    } catch (exc) {
      throw exc;
    }
  }

  async _initSocketIOServices() {
    try {
      // TODO: Sync socket peer Ids on each connect
      socket.on(EVT_SOCKET_CONNECT, async () => {
        try {
          await this.syncSocketPeerIds();
        } catch (exc) {
          throw exc;
        }
      });

      socket.on(SOCKET_API_EVT_PEER_CONNECT, this._handleSocketPeerConnect);
      socket.on(SOCKET_API_EVT_PEER_DISCONNECT, this._handleSocketPeerDisconnect);
      socket.on(SOCKET_API_EVT_PEER_DATA, this._handleReceivedSocketPeerDataPacket);

      this.on(EVT_BEFORE_EXIT, () => {
        socket.off(SOCKET_API_EVT_PEER_CONNECT, this._handleSocketPeerConnect);
        socket.off(SOCKET_API_EVT_PEER_DISCONNECT, this._handleSocketPeerDisconnect);
        socket.off(SOCKET_API_EVT_PEER_DATA, this._handleReceivedSocketPeerDataPacket);
      });

      // Perform initial sync
      // Post init; _init() has already finished when this starts
      this.setImmediate(async () => {
        try {
          await this.syncSocketPeerIds();
        } catch (exc) {
          throw exc;
        }
      });
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Fetches Socket Peer Ids from the server and sync them with P2PLinkedState.
   * 
   * @return {Promise<void>}
   */
  async syncSocketPeerIds(asInitial = true) {
    try {
      if (!this._hasInitialSocketPeerSync) {
        this._hasInitialSocketPeerSync = true;
      } else if (asInitial) {
        console.debug('Skipping second "initial" syncSocketPeerId()');
        return;
      }

      const socketPeerIds = await fetchSocketPeerIds();
          
      // Sync socketPeerIds with P2PLinkedState
      this._p2pLinkedState.setSocketPeerIds(socketPeerIds);
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Associates connected Socket.io peer with P2PLinkedState.
   */
  _handleSocketPeerConnect = (socketPeerId) => {
    if (this._p2pLinkedState) {
      this._p2pLinkedState.addSocketPeerId(socketPeerId);
    }

    _handleSocketPeerConnectionStatusUpdate(socketPeerId, true);
  }

  /**
   * Disassociates connected Socket.io peer with P2PLinkedState.
   */
  _handleSocketPeerDisconnect = (socketPeerId) => {
    if (this._p2pLinkedState) {
      this._p2pLinkedState.removeSocketPeerId(socketPeerId, false);
    }

    _handleSocketPeerConnectionStatusUpdate(socketPeerId, false);
  }

  _handleReceivedSocketPeerDataPacket = (dataPacket) => {
    _handleReceivedSocketPeerDataPacket(dataPacket);
  };

  async _initWebRTCServices() {
    try {
      console.warn('TODO: Handle WebRTC services init');
    } catch (exc) {
      throw exc;
    }
  }
}

export default P2PController;