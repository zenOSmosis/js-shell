import ClientProcess, { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import socket, {
  EVT_SOCKET_CONNECT,
  EVT_SOCKET_DISCONNECT,
  getIsConnected as getIsSocketConnected
} from 'utils/socket.io';
import { fetchConnectedPeers } from 'utils/p2p/socketPeer';
import P2PLinkedState, {
  ACTION_SET_REMOTE_PEERS,
  ACTION_ADD_REMOTE_PEER,
  ACTION_REMOVE_REMOTE_PEER_WITH_ID
} from 'state/P2PLinkedState';
import {
  SOCKET_API_EVT_PEER_ID_CONNECT,
  SOCKET_API_EVT_PEER_ID_DISCONNECT,
  SOCKET_API_EVT_PEER_DETAIL,
  SOCKET_API_EVT_PEER_DATA
} from 'shared/socketAPI/socketAPIEvents';
import {
  _handleSocketPeerConnectionStatusUpdate,
  _handleReceivedSocketPeerDataPacket
} from 'utils/p2p/socketPeer';
import Peer, { SHARED_DATA_KEY_PEER_ID } from 'utils/p2p/Peer.class';

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
    socket.on(EVT_SOCKET_CONNECT, this._syncConnectedSocketPeers);
    socket.on(EVT_SOCKET_DISCONNECT, this._syncConnectedSocketPeers);
    socket.on(SOCKET_API_EVT_PEER_ID_CONNECT, this._handleSocketPeerConnect);
    socket.on(SOCKET_API_EVT_PEER_ID_DISCONNECT, this._handleSocketPeerDisconnect);
    socket.on(SOCKET_API_EVT_PEER_DETAIL, this._handleReceivedSocketPeerDetail);
    socket.on(SOCKET_API_EVT_PEER_DATA, this._handleReceivedSocketPeerDataPacket);

    this.on(EVT_BEFORE_EXIT, () => {
      socket.off(EVT_SOCKET_CONNECT, this._syncConnectedSocketPeers);
      socket.off(EVT_SOCKET_DISCONNECT, this._syncConnectedSocketPeers);
      socket.off(SOCKET_API_EVT_PEER_ID_CONNECT, this._handleRemoteSocketPeerConnect);
      socket.off(SOCKET_API_EVT_PEER_ID_DISCONNECT, this._handleSocketPeerDisconnect);
      socket.off(SOCKET_API_EVT_PEER_DETAIL, this._handleReceivedSocketPeerDetail);
      socket.off(SOCKET_API_EVT_PEER_DATA, this._handleReceivedSocketPeerDataPacket);
    });

    // Perform initial sync
    // Post init; _init() has already finished when this starts
    this.setImmediate(async () => {
      try {
        await this._syncConnectedSocketPeers();
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
  _syncConnectedSocketPeers = async () => {
    try {
      let connectedSocketPeers = [];

      if (getIsSocketConnected()) {
        connectedSocketPeers = await fetchConnectedPeers();
      }

      // Sync socketPeerIds with P2PLinkedState
      this._p2pLinkedState.dispatchAction(ACTION_SET_REMOTE_PEERS, connectedSocketPeers);
    } catch (exc) {
      throw exc;
    }
  };

  _handleReceivedSocketPeerDetail = (socketPeerDetail) => {
    console.warn('TODO: _handleReceivedSocketPeerDetail', {
      socketPeerDetail
    });
  };

  /**
   * Associates connected Socket.io peer with P2PLinkedState.
   */
  // TODO: Handle for SocketPeer
  _handleSocketPeerConnect = (peerId) => {
    const peer = Peer.createFromRawData({
      [SHARED_DATA_KEY_PEER_ID]: peerId
    });
    this._p2pLinkedState.dispatchAction(ACTION_ADD_REMOTE_PEER, peer);

    const socketPeerId = peer.getPeerId();
    _handleSocketPeerConnectionStatusUpdate(socketPeerId, true);
  };

  /**
   * Disassociates connected Socket.io peer with P2PLinkedState.
   */
  // TODO: Handle for SocketPeer
  _handleSocketPeerDisconnect = (socketPeerId) => {
    this._p2pLinkedState.dispatchAction(ACTION_REMOVE_REMOTE_PEER_WITH_ID, socketPeerId);

    _handleSocketPeerConnectionStatusUpdate(socketPeerId, false);
  };

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