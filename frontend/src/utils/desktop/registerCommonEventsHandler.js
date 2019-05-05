import socket from 'utils/socket.io';
import createDesktopNotification from 'utils/desktop/createDesktopNotification';
import { EVT_LINKED_STATE_UPDATE, commonDesktopLinkedState } from 'state/DesktopLinkedState';

const onConnect = () => {
  createDesktopNotification({
    message: 'Connected to host',
    description: 'A Socket.io connection has been established to the host machine'
  });
};

const onDisconnect = () => {
  createDesktopNotification({
    message: 'Disconnected from host',
    description: 'The Socket.io connection has been dropped from the host machine'
  });
};

let isRegistered = false;

/**
 * Common Desktop event handling.
 * 
 * Handles events such as Socket.io connect / disconnect, Common Desktop Linked
 * State, etc.
 */
const registerCommonEventsHandler = () => {
  if (isRegistered) {
    console.warn('Desktop Common Events Handler has already been registered');
    return;
  }

  // Socket.io events
  (() => {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);  
  })();

  // DesktopLinkedState events
  (() => {
    commonDesktopLinkedState.on(EVT_LINKED_STATE_UPDATE, (updatedState) => {
      console.debug('Common Desktop Linked State update', updatedState);

      // Context Menu
      (() => {
        const { contextMenuIsTrapping } = updatedState;

        if (typeof contextMenuIsTrapping !== 'undefined') {
          if (contextMenuIsTrapping) {
            createDesktopNotification({
              message: 'Context Menu is trapping'
            });
          } else {
            createDesktopNotification({
              message: 'Context Menu is not trapping'
            });
          }
        }
      })();
    });
  })();

  isRegistered = true;
};

export default registerCommonEventsHandler;