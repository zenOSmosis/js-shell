import socket from 'utils/socket.io';
import { commonDesktopLinkedState, EVT_LINKED_STATE_UPDATE } from 'state/commonLinkedStates';
import createDesktopNotification from 'utils/desktop/createDesktopNotification';

let _isRegistered = false;

/**
 * Common Desktop event handling.
 * 
 * Handles events such as Socket.io connect / disconnect, Common Desktop Linked
 * State, etc.
 */
const registerCommonEventsHandler = () => {
  if (_isRegistered) {
    console.warn('Desktop Common Events Handler has already been registered');
    return;
  }

  // console.debug('Registering Common Desktop Events handling');

  // Socket.io events
  (() => {
    socket.on('connect', onSocketConnect);
    socket.on('disconnect', onSocketDisconnect);  
  })();

  // DesktopLinkedState events
  (() => {
    commonDesktopLinkedState.on(EVT_LINKED_STATE_UPDATE, (updatedState) => {
      // console.debug('Common Desktop Linked State update', updatedState);

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

  _isRegistered = true;
};

const onSocketConnect = () => {
  createDesktopNotification({
    message: 'Connected to host',
    description: 'A Socket.io connection has been established to the host machine'
  });
};

const onSocketDisconnect = () => {
  createDesktopNotification({
    message: 'Disconnected from host',
    description: 'The Socket.io connection has been dropped from the host machine'
  });
};

export default registerCommonEventsHandler;