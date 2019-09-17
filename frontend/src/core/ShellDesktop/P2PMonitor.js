// TODO: Rename to P2PDelegate, or something along those lines

import ClientProcess, { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import socket, { EVT_SOCKET_CONNECT } from 'utils/socket.io';
import fetchSocketPeerIDs from 'utils/p2p/socket.io/fetchSocketPeerIDs';
import P2PLinkedState, { ACTION_SET_LAST_RECEIVED_SOCKET_PEER_DATA_PACKET } from 'state/P2PLinkedState';
import {
  SOCKET_API_EVT_PEER_CONNECT,
  SOCKET_API_EVT_PEER_DISCONNECT,
  SOCKET_API_EVT_PEER_DATA
} from 'shared/socketAPI/socketAPIEvents';
import createSocketPeerReceivedReceiptDataPacket from 'utils/p2p/socket.io/createSocketPeerReceivedReceiptDataPacket';
import sendSocketPeerDataPacket from 'utils/p2p/socket.io/sendSocketPeerDataPacket';

/**
 * Listens to P2P actions and bind them to P2PLinkedState.
 * 
 * @extends ClientProcess
 */
class P2PMonitor extends ClientProcess {
  constructor(...args) {
    super(...args);

    this._p2pLinkedState = null;
    this._hasInitialSocketPeerSync = false;
  };

  async _init() {
    try {
      this.setTitle('P2P Monitor');

      this._p2pLinkedState = new P2PLinkedState();

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
      // TODO: Sync socket peer IDs on each connect
      socket.on(EVT_SOCKET_CONNECT, async () => {
        try {
          await this.syncSocketPeerIDs();
        } catch (exc) {
          throw exc;
        }
      });

      socket.on(SOCKET_API_EVT_PEER_CONNECT, this._handleSocketPeerConnect);
      socket.on(SOCKET_API_EVT_PEER_DISCONNECT, this._handleSocketPeerDisconnect);
      socket.on(SOCKET_API_EVT_PEER_DATA, this._handleReceivedSocketPeerData);

      this.on(EVT_BEFORE_EXIT, () => {
        socket.off(SOCKET_API_EVT_PEER_CONNECT, this._handleSocketPeerConnect);
        socket.off(SOCKET_API_EVT_PEER_DISCONNECT, this._handleSocketPeerDisconnect);
        socket.off(SOCKET_API_EVT_PEER_DATA, this._handleReceivedSocketPeerData);

        // Reset so that any UI views / etc. don't show connected peers
        this._p2pLinkedState.reset();

        // Unlink P2PLinkedState
        this._p2pLinkedState.destroy();
        this._p2pLinkedState = null;
      });

      // Perform initial sync
      // Post init; _init() has already finished when this starts
      this.setImmediate(async () => {
        try {
          await this.syncSocketPeerIDs();
        } catch (exc) {
          throw exc;
        }
      });
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Fetches Socket Peer IDs from the server and sync them with P2PLinkedState.
   * 
   * @return {Promise<void>}
   */
  async syncSocketPeerIDs(asInitial = true) {
    try {
      if (!this._hasInitialSocketPeerSync) {
        this._hasInitialSocketPeerSync = true;
      } else if (asInitial) {
        console.debug('Skipping second "initial" syncSocketPeerID()');
        return;
      }

      const socketPeerIDs = await fetchSocketPeerIDs();
          
      // Sync socketPeerIDs with P2PLinkedState
      this._p2pLinkedState.setSocketPeerIDs(socketPeerIDs);
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Associates connected Socket.io peer with P2PLinkedState.
   */
  _handleSocketPeerConnect = (socketPeerID) => {
    if (this._p2pLinkedState) {
      this._p2pLinkedState.addSocketPeerID(socketPeerID);
    }
  }

  /**
   * Disassociates connected Socket.io peer with P2PLinkedState.
   */
  _handleSocketPeerDisconnect = (socketPeerID) => {
    if (this._p2pLinkedState) {
      this._p2pLinkedState.removeSocketPeerID(socketPeerID);
    }
  }

  _handleReceivedSocketPeerData = (receivedData) => {
    console.debug('received data', {
      receivedData
    });

    const { isReceivedReceiptRequested } = receivedData;

    this._p2pLinkedState.dispatchAction(ACTION_SET_LAST_RECEIVED_SOCKET_PEER_DATA_PACKET, receivedData);

    if (isReceivedReceiptRequested) {
      const {
        fromSocketPeerID: toSocketPeerID,
        packetUUID: originPacketUUID
      } = receivedData;

      // TODO: Create received receipt and return it
      const receivedReceiptDataPacket = createSocketPeerReceivedReceiptDataPacket(toSocketPeerID, originPacketUUID);

      console.debug('created received receipt data packet', receivedReceiptDataPacket);

      sendSocketPeerDataPacket(receivedReceiptDataPacket);
    }
  };

  async _initWebRTCServices() {
    try {
      console.warn('TODO: Handle WebRTC services init');
    } catch (exc) {
      throw exc;
    }
  }
}

export default P2PMonitor;