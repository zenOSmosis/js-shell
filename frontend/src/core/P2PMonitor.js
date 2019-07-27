import ClientProcess, { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import socket from 'utils/socket.io';
import socketQuery from 'utils/socketQuery';
import P2PLinkedState from 'state/P2PLinkedState';
import {
  SOCKET_API_EVT_PEER_CONNECT,
  SOCKET_API_EVT_PEER_DISCONNECT
} from 'utils/socketAPIEvents';

// TODO: Use same import API as socketAPIEvents once updated on backend
import socketAPIRoutes from 'utils/socketAPIRoutes';
const { SOCKET_API_ROUTE_FETCH_SERVER_CONNECTIONS } = socketAPIRoutes;

/**
 * Listens to P2P actions and bind them to P2PLinkedState.
 */
export default class P2PMonitor extends ClientProcess {
  async _init() {
    try {
      this.setTitle('P2P Monitor');

      this._p2pLinkedState = new P2PLinkedState();

      socket.on(SOCKET_API_EVT_PEER_CONNECT, this._handlePeerConnect);
      socket.on(SOCKET_API_EVT_PEER_DISCONNECT, this._handlePeerDisconnect);

      this.on(EVT_BEFORE_EXIT, () => {
        socket.off(SOCKET_API_EVT_PEER_CONNECT, this._handlePeerConnect);
        socket.off(SOCKET_API_EVT_PEER_DISCONNECT, this._handlePeerDisconnect);

        // Reset so that any UI views / etc. don't show connected peers
        this._p2pLinkedState.reset();

        // Unlink P2PLinkedState
        this._p2pLinkedState.destroy();
        this._p2pLinkedState = null;
      });

      await super._init();

      // Perform initial sync
      // Post init; _init() has already finished when this starts
      this.setImmediate(async () => {
        try {
          const socketPeers = await socketQuery(SOCKET_API_ROUTE_FETCH_SERVER_CONNECTIONS);
          
          this._p2pLinkedState.setSocketPeers(socketPeers);
        } catch (exc) {
          throw exc;
        }
      });
    } catch (exc) {
      throw exc;
    }
  }

  _handlePeerConnect = (socketId) => {
    if (this._p2pLinkedState) {
      this._p2pLinkedState.addSocketPeer(socketId);
    }
  }

  _handlePeerDisconnect = (socketId) => {
    if (this._p2pLinkedState) {
      this._p2pLinkedState.removeSocketPeer(socketId);
    }
  }
}