import { commonDesktopLinkedState, commonSocketLinkedState, EVT_LINKED_STATE_UPDATE } from 'state/commonLinkedStates';
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

  (() => {
    // Socket
    commonSocketLinkedState.on(EVT_LINKED_STATE_UPDATE, (updatedState) => {
      // Socket connection
        const { connectionStatus } = updatedState;
        
        if (typeof connectionStatus !== 'undefined') {
          console.warn('TODO: Update notification to be pretty');
          createDesktopNotification({
            message: 'Socket.io connection status update',
            description: connectionStatus
          });
        }
    });

    // Desktop
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

export default registerCommonEventsHandler;