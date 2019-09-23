import ClientProcess, { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import socket, {
  EVT_SOCKET_CONNECT,
  EVT_SOCKET_DISCONNECT,
  getIsConnected as getIsSocketConnected
} from 'utils/socket.io';
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
      this._initSocketIOServices();

      /*
      console.debug('Initialzing WebRTC services');
      this._initWebRTCServices();
      */

      await super._init();

    } catch (exc) {
      throw exc;
    }
  }

  _initSocketIOServices() {
    socket.on(EVT_SOCKET_CONNECT, this._syncSocketPeerIds);
    socket.on(EVT_SOCKET_DISCONNECT, this._syncSocketPeerIds);
    socket.on(SOCKET_API_EVT_PEER_CONNECT, this._handleSocketPeerConnect);
    socket.on(SOCKET_API_EVT_PEER_DISCONNECT, this._handleSocketPeerDisconnect);
    socket.on(SOCKET_API_EVT_PEER_DATA, this._handleReceivedSocketPeerDataPacket);

    this.on(EVT_BEFORE_EXIT, () => {
      socket.off(EVT_SOCKET_CONNECT, this._syncSocketPeerIds);
      socket.off(EVT_SOCKET_DISCONNECT, this._syncSocketPeerIds);
      socket.off(SOCKET_API_EVT_PEER_CONNECT, this._handleRemoteSocketPeerConnect);
      socket.off(SOCKET_API_EVT_PEER_DISCONNECT, this._handleSocketPeerDisconnect);
      socket.off(SOCKET_API_EVT_PEER_DATA, this._handleReceivedSocketPeerDataPacket);
    });

    // Perform initial sync
    // Post init; _init() has already finished when this starts
    this.setImmediate(async () => {
      try {
        await this._syncSocketPeerIds();
      } catch (exc) {
        throw exc;
      }
    });
  }

  /**
   * Fetches Socket Peer Ids from the server and sync them with P2PLinkedState.
   * 
   * @return {Promise<void>}
   */
  _syncSocketPeerIds = async () => {
    try {
      let socketPeerIds = [];

      if (getIsSocketConnected()) {
        socketPeerIds = await fetchSocketPeerIds();
      }

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

  /*
  _initWebRTCServices() {
    console.warn('TODO: Handle WebRTC services init');
  }
  */
}

export default P2PController;