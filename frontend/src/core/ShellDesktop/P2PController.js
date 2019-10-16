import ClientProcess, { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import Peer, { SHARED_DATA_KEY_USER_ID } from 'utils/p2p/Peer.class';
import socket, {
  EVT_SOCKET_CONNECT,
  EVT_SOCKET_DISCONNECT,
  getIsConnected as getIsSocketConnected
} from 'utils/socket.io';
import {
  SOCKET_API_EVT_PEER_ID_CONNECT,
  SOCKET_API_EVT_PEER_ID_DISCONNECT,
  SOCKET_API_EVT_PEER_DETAIL,
  SOCKET_API_EVT_PEER_DATA
} from 'shared/socketAPI/socketAPIEvents';
import {
  fetchConnectedPeers,
  _handleSocketPeerConnectionStatusUpdate,
  _routeReceivedSocketPeerDataPacket
} from 'utils/p2p/socketPeer';

/**
 * Listens to P2P actions and bind them to P2PLinkedState.
 * 
 * @extends ClientProcess
 */
class P2PController extends ClientProcess {
  async _init() {
    try {
      this.setTitle('P2P Controller');

      console.debug('Initializing Socket.io peer connections');
      this._initSocketIOServices();

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
    socket.on(SOCKET_API_EVT_PEER_DATA, this._routeReceivedSocketPeerDataPacket);

    this.on(EVT_BEFORE_EXIT, () => {
      socket.off(EVT_SOCKET_CONNECT, this._syncConnectedSocketPeers);
      socket.off(EVT_SOCKET_DISCONNECT, this._syncConnectedSocketPeers);
      socket.off(SOCKET_API_EVT_PEER_ID_CONNECT, this._handleRemoteSocketPeerConnect);
      socket.off(SOCKET_API_EVT_PEER_ID_DISCONNECT, this._handleSocketPeerDisconnect);
      socket.off(SOCKET_API_EVT_PEER_DETAIL, this._handleReceivedSocketPeerDetail);
      socket.off(SOCKET_API_EVT_PEER_DATA, this._routeReceivedSocketPeerDataPacket);
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
   * Fetches Socket Peers from the server and sync them with P2PLinkedState.
   * 
   * @return {Promise<Peer[]>}
   */
  _syncConnectedSocketPeers = async () => {
    try {
      let connectedSocketPeers = [];

      if (getIsSocketConnected()) {
        connectedSocketPeers = await fetchConnectedPeers();
      }

      return connectedSocketPeers;
    } catch (exc) {
      throw exc;
    }
  };

  _handleReceivedSocketPeerDetail = (socketPeerSharedData) => {
    Peer.createFromRawData(socketPeerSharedData);
  }

  _handleSocketPeerConnect = (peerId) => {
    const peer = Peer.createFromRawData({
      [SHARED_DATA_KEY_USER_ID]: peerId
    });

    peer.setIsOnline(true);

    _handleSocketPeerConnectionStatusUpdate(peer, true);
  }
  
  _handleSocketPeerDisconnect = (socketPeerId) => {
    const peer = Peer.createFromRawData({
      [SHARED_DATA_KEY_USER_ID]: socketPeerId
    });

    peer.setIsOnline(false);

    _handleSocketPeerConnectionStatusUpdate(peer, false);
  }

  _routeReceivedSocketPeerDataPacket = (dataPacket) => {
    _routeReceivedSocketPeerDataPacket(dataPacket);
  }
}

export default P2PController;