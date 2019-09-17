import createDesktopNotification from 'utils/desktop/createDesktopNotification';

/**
 * Internally called when the Socket.io connection is connected.
 */
const _handleSocketConnect = () => {
  createDesktopNotification(`Socket.io connected`);
};

export default _handleSocketConnect;