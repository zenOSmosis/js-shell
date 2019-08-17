import DesktopLinkedState from 'state/DesktopLinkedState';
// import { commonDesktopLinkedState } from 'state/commonLinkedStates';

const commonDesktopLinkedState = new DesktopLinkedState();

/**
 * 
 * @param {string} message 
 * @param {string} description?
 * @param {function} onClick? 
 */
const createDesktopNotification = (message, description = null, onClick = null) => {
  if (typeof message === 'object') {
    onClick = message.onClick;
    description = message.description;
    message = message.message;
  }

  commonDesktopLinkedState.setState({
    lastNotification: {
      message,
      description,
      onClick
    }
  });
};

export default createDesktopNotification;