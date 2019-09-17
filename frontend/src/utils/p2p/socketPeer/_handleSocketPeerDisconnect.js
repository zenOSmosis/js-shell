import createDesktopNotification from 'utils/desktop/createDesktopNotification';

const _handleSocketPeerDisconnect = (socketPeerID) => {
  createDesktopNotification(`SocketPeer with ID "${socketPeerID}" disconnected`);
};

export default _handleSocketPeerDisconnect;