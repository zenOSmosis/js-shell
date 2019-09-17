import createDesktopNotification from 'utils/desktop/createDesktopNotification';

const handleSocketPeerDisconnect = (socketPeerID) => {
  createDesktopNotification(`SocketPeer with ID "${socketPeerID}" disconnected`);
};

export default handleSocketPeerDisconnect;