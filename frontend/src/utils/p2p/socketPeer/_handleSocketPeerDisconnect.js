import createDesktopNotification from 'utils/desktop/createDesktopNotification';

/**
 * Internally called when a remote SocketPeer disconnects.
 * 
 * @param {string} socketPeerID
 */
const _handleSocketPeerDisconnect = (socketPeerID) => {
  createDesktopNotification(`SocketPeer with ID "${socketPeerID}" disconnected`);
};

export default _handleSocketPeerDisconnect;