import createDesktopNotification from 'utils/desktop/createDesktopNotification';
import Peer from '../Peer.class';

/**
 * Internally called when a remote SocketPeer connects.
 * 
 * IMPORTANT! This is solely for UI effects, as the P2PLinkedState should be
 * managed directly via core/ShellDesktop/P2PController.
 * 
 * @param {peer} Peer
 * @param {boolean} isConnected
 */
const _handleSocketPeerConnectionStatusUpdate = (peer, isConnected) => {
  if (!(peer instanceof Peer)) {
    throw new Error('peer must be a Peer instance');
  }
  
  setTimeout(() => {  
    const normalizedNickname = peer.getNormalizedNickname();
  
    createDesktopNotification(`${normalizedNickname} ${!isConnected ? 'dis' : ''}connected`);
  }, isConnected ? 1000 : 0); // Allow peer data to synchronize on new connections
};

export default _handleSocketPeerConnectionStatusUpdate;