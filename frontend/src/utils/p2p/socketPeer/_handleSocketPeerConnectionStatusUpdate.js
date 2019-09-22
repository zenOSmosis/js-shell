import createDesktopNotification from 'utils/desktop/createDesktopNotification';

/**
 * Internally called when a remote SocketPeer connects.
 * 
 * @param {string} socketPeerId
 * @param {boolean} isConnected
 */
const _handleSocketPeerConnectionStatusUpdate = (socketPeerId, isConnected) => {
  createDesktopNotification(`SocketPeer with Id "${socketPeerId}" ${!isConnected ? 'dis' : ''}connected`);
};

export default _handleSocketPeerConnectionStatusUpdate;