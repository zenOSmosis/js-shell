import createDesktopNotification from 'utils/desktop/createDesktopNotification';

const _handleSocketPeerConnect = (socketPeerID) => {
  createDesktopNotification(`SocketPeer with ID "${socketPeerID}" connected`);
};

export default _handleSocketPeerConnect;