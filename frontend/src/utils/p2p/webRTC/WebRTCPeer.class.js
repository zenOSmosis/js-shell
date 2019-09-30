import EventEmitter from 'events';
import Peer from '../Peer.class';
import SimplePeer from 'simple-peer';
import { 
  createSocketPeerDataPacket, 
  sendSocketPeerDataPacket
} from '../socketPeer';

export const SOCKET_PEER_WEB_RTC_SIGNAL_PACKET_TYPE = 'webRTCSignal';

class WebRTCPeer extends EventEmitter {
  static async initiateConnection(remotePeer, mediaStream = null) {
    let webRTCPeer = remotePeer.getWebRTCPeer();
    if (!webRTCPeer) {
      webRTCPeer = new WebRTCPeer(true, remotePeer, mediaStream);
    }

    await webRTCPeer.connect(true);

    return webRTCPeer;
  }

  static async handleReceivedSignalDataPacket(webRTCSignalDataPacket) {
    try {
      /*
      console.warn('TODO: Handle received WebRTC signal', {
        webRTCSignalDataPacket
      });
      */

      const { fromPeerId, data: signalData } = webRTCSignalDataPacket;
      const remotePeer = Peer.getPeerWithId(fromPeerId);
      if (!remotePeer) {
        console.error(`Remote peer does not exist in cache with id: ${fromPeerId}`);
        return;
      }
      
      let webRTCPeer = remotePeer.getWebRTCPeer();
      if (!webRTCPeer) {
        webRTCPeer = new WebRTCPeer(false, remotePeer); // TODO: Handle media stream
      }

      if (!webRTCPeer.getIsConnecting() && !webRTCPeer.getIsConnected()) {
        await webRTCPeer.connect();
      }

      webRTCPeer.signal(signalData);
    } catch (exc) {
      throw exc;
    }
  }

  constructor(isInitiator, remotePeer, mediaStream = null) {
    super();

    this._isInitiator = isInitiator;
    this._remotePeer = remotePeer;
    this._remotePeer.setWebRTCPeer(this);

    this._mediaStream = mediaStream;

    this._simplePeer = null;

    this._isConnected = false;
    this._isConnecting = false;

    // Automatically connect
    // this.connect();
  }

  sleep(ms = 1000) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  async connect(asInitiator = null) {
    try {
      if (this._isConnecting) {
        console.warn('Aborted connect attempt because it is already in a connecting state');
  
        return;
      }

      if (this._isConnected) {
        await this.disconnect();

        await this.sleep();
      }
  
      this._isConnecting = true;
  
      this._simplePeer = null;
  
      if (asInitiator !== null) {
        this._isInitiator = asInitiator;
      }
  
      const remotePeerId = this._remotePeer.getPeerId();
  
      this._simplePeer = new SimplePeer({
        initiator: this._isInitiator,
        // stream: this._mediaStream
      });
    
      this._simplePeer.on('signal', signalData => {
        const dataPacket = createSocketPeerDataPacket(remotePeerId, SOCKET_PEER_WEB_RTC_SIGNAL_PACKET_TYPE, signalData);
        sendSocketPeerDataPacket(dataPacket);
  
        console.debug(`Received signal from peer with id: ${remotePeerId}`);
      });
    
      this._simplePeer.on('connect', () => {
        this._isConnecting = false;
        this._isConnected = true;
  
        console.debug(`WebRTC connected to remote peer with id: ${remotePeerId}`);
      });

      this._simplePeer.on('close', () => {
        this._isConnecting = false;
        this._isConnected = false;
        this._simplePeer = null;
  
        console.debug(`WebRTC connection has closed from peer with id: ${remotePeerId}`);
      });
    
      this._simplePeer.on('error', err => {
        console.error(err);
      });
    
      // Emits when received data from remote
      /*
      localWebRTCUser.on('data', data => {
    
      });
      */
    } catch (exc) {
      throw exc;
    }
  }

  getIsConnected() {
    return this._isConnected;
  }

  getIsConnecting() {
    return this._isConnecting;
  }

  signal(signalData) {
    try {
      this._simplePeer.signal(signalData);
    } catch (exc) {
      console.error(exc);
    }
  }

  disconnect() {
    if (this._simplePeer) {
      return new Promise((resolve, reject) => {
        this._simplePeer.once('close', () => {
          this._isConnecting = false;
          this._isConnected = false;
          this._simplePeer = null;
          
          resolve();
        });
        
        this._simplePeer.destroy();
      });
    } else {
      this._simplePeer = null;
    }
  }
}

export default WebRTCPeer;