// TODO: Automatically disconnect when Peer disconnects (or loses connection)

import EventEmitter from 'events';
import Peer from './Peer.class';
import SimplePeer from 'simple-peer';
import {
  createSocketPeerDataPacket,
  sendSocketPeerDataPacket
} from './socketPeer';
import { serializeError, deserializeError } from 'serialize-error';
import sleep from 'utils/sleep';

export const SOCKET_PEER_WEB_RTC_SIGNAL_PACKET_TYPE = 'webRTCSignal';
export const SOCKET_PEER_WEB_RTC_ERROR_PACKET_TYPE = 'webRTCError';

// Emitted between Peers when one wishes to disconnect
export const EVT_REQUEST_DISCONNECT = 'requestDisconnect';

export const EVT_CONNECT_IN_PROGRESS = 'connectInProgress';
export const EVT_CONNECT = 'connect';
export const EVT_DATA = 'data';
export const EVT_STREAM = 'stream';
export const EVT_CONNECT_ERROR = 'connectError';
export const EVT_DISCONNECT = 'disconnect';

class WebRTCPeer extends EventEmitter {
  /**
   * Initiates a WebRTC connection with the given Peer.
   * 
   * Note: This either creates a new WebRTC instance, or reuses an existing one
   * if one is already attached to the remotePeer.
   * 
   * @param {Peer} remotePeer 
   * @param {MediaStream} mediaStream? Optional media stream to send to remote
   * Peer
   * @return {Promise<WebRTCPeer>}
   */
  /*
  static async initConnection(remotePeer) {
    try {
      let webRTCPeer = remotePeer.getWebRTCPeer();
      if (!webRTCPeer) {
        webRTCPeer = new WebRTCPeer(remotePeer);
      }

      const outgoingMediaStreams = remotePeer.getWebRTCOutgoingMediaStream();
      const mediaStream = outgoingMediaStreams ? outgoingMediaStreams[0] : null;

      await webRTCPeer.initConnection(true, mediaStream);

      return webRTCPeer;
    } catch (exc) {
      throw exc;
    }
  }
  */

  /**
   * 
   * @param {SocketPeerDataPacket} dataPacket 
   */
  static async handleReceivedSocketPeerDataPacket(dataPacket) {
    try {
      const { packetType, fromPeerId } = dataPacket;
      const remotePeer = Peer.getPeerWithId(fromPeerId);

      if (!remotePeer) {
        console.error(`Remote peer "${fromPeerId}" does not exist in cache`);
        return;
      }

      let webRTCPeer = remotePeer.getWebRTCPeer();
      if (!webRTCPeer) {
        webRTCPeer = new WebRTCPeer(remotePeer);
      }

      switch (packetType) {
        case SOCKET_PEER_WEB_RTC_SIGNAL_PACKET_TYPE:
          await (async () => {
            try {
              const { data: signalData } = dataPacket;

              // Don't accept signals if the WebRTCPeer state is rejected
              if (webRTCPeer.getHasRejected()) {
                console.warn('Ignoring RTC signal because of rejection status', {
                  signalData
                });
                return;
              }

              // Init a new WebRTCPeer connection if an existing one is not
              // already established
              if (!webRTCPeer.getIsConnecting() && !webRTCPeer.getIsConnected()) {
                try {
                  await remotePeer.handleWebRTCIncomingCallRequest();
                } catch (exc) {
                  throw exc;
                }
              }

              webRTCPeer.signal(signalData);
            } catch (exc) {
              console.error(exc);

              await webRTCPeer.reject();
            }
          })();
          break;

        case SOCKET_PEER_WEB_RTC_ERROR_PACKET_TYPE:
          await (async () => {
            try {
              const { data: errorData } = dataPacket;

              console.error(`Remote peer "${fromPeerId}" WebRTC error`, {
                errorData
              });

              if (!webRTCPeer) {
                return;
              }

              // Mirror the disconnect state to the local representation of the remote peer
              await webRTCPeer.disconnect();
            } catch (exc) {
              throw exc;
            }
          })();
          break;

        default:
          console.warn(`Unknown WebRTCPeer SocketPeerDataPacket with type: ${packetType}`);
          break;
      }

    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Disconnects the WebRTC connection from the given Peer.
   * 
   * @param {Peer} remotePeer
   * @return {Promise<void>}
   */
  /*
  static async disconnect(remotePeer) {
    try {
      let webRTCPeer = remotePeer.getWebRTCPeer();
      if (webRTCPeer) {
        await webRTCPeer.disconnect();
      }
    } catch (exc) {
      throw exc;
    }
  }
  */

  /**
   * @param {Peer} remotePeer 
   */
  constructor(remotePeer) {
    super();

    this._remotePeer = remotePeer;

    this._simplePeer = null;

    this._isConnected = false;
    this._isConnecting = false;
    this._connectError = null;
    this._hasRejected = false;
  }

  /**
   * IMPORTANT! This resolves after the underlying SimplePeer engine has
   * initialized, NOT after it connects.
   * 
   * @param {boolean} asInitiator 
   * @param {MediaStream} mediaStream?
   * @return {Promise<void>}
   */
  async initConnection(asInitiator, mediaStream = null) {
    try {
      if (this._isConnecting) {
        console.warn('Aborted connect attempt because it is already in a connecting state');

        return;
      } else if (this._isConnected) {
        await this.disconnect();

        // Pause to let the other peer sync up
        await sleep(1000);
      }

      this._simplePeer = null;

      this._isConnecting = true;
      this._connectError = null;
      this._hasRejected = false;

      if (asInitiator !== null) {
        this._isInitiator = asInitiator;
      }

      const remotePeerId = this._remotePeer.getPeerId();

      this._simplePeer = new SimplePeer({
        initiator: this._isInitiator,
        stream: mediaStream
      });

      /**
       * @type {SimplePeer.SignalData} signalData
       */
      this._simplePeer.on('signal', signalData => {
        const dataPacket = createSocketPeerDataPacket(remotePeerId, SOCKET_PEER_WEB_RTC_SIGNAL_PACKET_TYPE, signalData);
        sendSocketPeerDataPacket(dataPacket);

        console.debug(`Emitting signal to peer with id: ${remotePeerId}`, {
          signalData
        });
      });

      // Called when WebRTC connects
      this._simplePeer.on('connect', () => {
        this._isConnecting = false;
        this._isConnected = true;

        this.emit(EVT_CONNECT);

        console.debug(`WebRTC connected to remote peer with id: ${remotePeerId}`);
      });

      // Called when WebRTC receives remote stream
      this._simplePeer.on('stream', stream => {
        this.emit(EVT_STREAM, stream);

        console.debug(`WebRTC connection received stream from peer with id: ${remotePeerId}`, stream);
      });

      // Called when WebRTC receives remote data
      this._simplePeer.on('data', data => {
        this.emit(EVT_DATA);

        console.debug(`WebRTC connection received data from peer with id: ${remotePeerId}`, data);

        // Checking data length before trying to convert data to string
        if (data.length === EVT_REQUEST_DISCONNECT.length &&
          data.toString() === EVT_REQUEST_DISCONNECT) {
          this.disconnect();
        }
      });

      // Called when WebRTC receives remote error
      this._simplePeer.on('error', jsonError => {
        this._connectError = deserializeError(jsonError);

        const errorDataPacket = createSocketPeerDataPacket(remotePeerId, SOCKET_PEER_WEB_RTC_ERROR_PACKET_TYPE, this._connectError);
        sendSocketPeerDataPacket(errorDataPacket);

        this.emit(EVT_CONNECT_ERROR, this._connectError);

        console.error(`WebRTC connection has errored with peer with id: ${remotePeerId}`, {
          err: this._connectError
        });

        this.disconnect();
      });

      // Called when WebRTC connection stops
      this._simplePeer.on('close', () => {
        this._isConnecting = false;
        this._isConnected = false;

        this.emit(EVT_DISCONNECT);

        // Important! Remove all event listeners from underlying SimplePeer
        // library, or there will be a memory leak when we set it to null
        this._simplePeer.removeAllListeners();

        this._simplePeer = null;

        console.debug(`WebRTC connection has closed from peer with id: ${remotePeerId}`);
      });

      this.emit(EVT_CONNECT_IN_PROGRESS);

    } catch (exc) {
      throw exc;
    }
  }

  /**
   * Retrieves whether or not the WebRTCPeer is currently connectING.
   * 
   * @return {boolean}
   */
  getIsConnecting() {
    return this._isConnecting;
  }

  /**
   * Retrieves whether or not the WebRTCPeer is currently connectED.
   * 
   * @return {boolean}
   */
  getIsConnected() {
    return this._isConnected;
  }

  /**
   * @return {Error}
   */
  getConnectError() {
    return this._connectError;
  }

  /**
   * Rejects the recent call attempt.
   * 
   * @return {Promise<void>}
   */
  async reject() {
    try {
      const remotePeerId = this._remotePeer.getPeerId();

      this._hasRejected = true;

      // Emit rejection data to remote Peer
      // TODO: Use custom Error handler
      const errorDataPacket = createSocketPeerDataPacket(remotePeerId, SOCKET_PEER_WEB_RTC_ERROR_PACKET_TYPE, serializeError(new Error('WebRTCRejection')));
      sendSocketPeerDataPacket(errorDataPacket);

      await sleep(1000);

      // Reset rejection state so a new call can be made
      this._hasRejected = false;
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * @return {boolean} Resolves true if WebRTCPeer is currently rejecting the
   * most recent call.
   */
  getHasRejected() {
    return this._hasRejected;
  }

  /**
   * @param {SimplePeer.SignalData} signalData 
   */
  signal(signalData) {
    try {
      this._simplePeer.signal(signalData);

      const remotePeerId = this._remotePeer.getPeerId();
      console.debug(`Received signal from peer with id: ${remotePeerId}`, {
        signalData
      });
    } catch (exc) {
      console.error(exc);
    }
  }

  /**
   * @return {Promise<void>}
   */
  disconnect() {
    if (this._simplePeer) {
      if (this._isConnected) {
        this._simplePeer.send(EVT_REQUEST_DISCONNECT);
      }

      return new Promise((resolve, reject) => {
        this._simplePeer.once('close', () => {

          // Note: EVT_DISCONNECT is emitted directly within simplePeer close handler

          resolve();
        });

        this._simplePeer.destroy();
      });
    }
  }
}

export default WebRTCPeer;