import createDesktopNotification from 'utils/desktop/createDesktopNotification';

const handleSocketPeerConnect = (socketPeerID) => {
  createDesktopNotification(`SocketPeer with ID "${socketPeerID}" connected`);
};

export default handleSocketPeerConnect;