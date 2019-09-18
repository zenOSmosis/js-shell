import createDesktopNotification from 'utils/desktop/createDesktopNotification';

/**
 * Internally called when the Socket.io connection is connected.
 * 
 * @param {boolean} isConnected
 */
const _handleSocketConnectionStatusUpdate = (isConnected) => {
  createDesktopNotification(`Socket.io ${!isConnected ? 'dis' : ''}connected`);
};

export default _handleSocketConnectionStatusUpdate;