import DesktopLinkedState from 'state/DesktopLinkedState';
// import { commonDesktopLinkedState } from 'state/commonLinkedStates';

const commonDesktopLinkedState = new DesktopLinkedState();

/**
 * 
 * @param {string | ReactNode} message 
 * @param {string | ReactNode} description?
 * @param {function} onClick? 
 */
const createDesktopNotification = (message, description = null, onClick = null) => {
  /*
  if (typeof message === 'object') {
    onClick = message.onClick;
    description = message.description;
    message = message.message;
  }
  */

  commonDesktopLinkedState.setState({
    lastNotification: {
      message,
      description,
      onClick
    }
  });
};

export default createDesktopNotification;