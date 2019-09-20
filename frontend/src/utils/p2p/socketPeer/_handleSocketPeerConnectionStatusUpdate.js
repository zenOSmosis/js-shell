import createDesktopNotification from 'utils/desktop/createDesktopNotification';

/**
 * Internally called when a remote SocketPeer connects.
 * 
 * @param {string} socketPeerID
 * @param {boolean} isConnected
 */
const _handleSocketPeerConnectionStatusUpdate = (socketPeerID, isConnected) => {
  createDesktopNotification(`SocketPeer with ID "${socketPeerID}" ${!isConnected ? 'dis' : ''}connected`);
};

export default _handleSocketPeerConnectionStatusUpdate;