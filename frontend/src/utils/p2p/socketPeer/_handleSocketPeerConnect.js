import createDesktopNotification from 'utils/desktop/createDesktopNotification';

/**
 * Internally called when a remote SocketPeer connects.
 * 
 * @param {string} socketPeerID 
 */
const _handleSocketPeerConnect = (socketPeerID) => {
  createDesktopNotification(`SocketPeer with ID "${socketPeerID}" connected`);
};

export default _handleSocketPeerConnect;