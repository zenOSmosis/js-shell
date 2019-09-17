import createDesktopNotification from 'utils/desktop/createDesktopNotification';

/**
 * Internally called when the Socket.io connection is disconnected.
 */
const _handleSocketDisconnect = () => {
  createDesktopNotification(`Socket.io disconnected`);
};

export default _handleSocketDisconnect;