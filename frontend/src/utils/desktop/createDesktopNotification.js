import DesktopLinkedState from 'state/DesktopLinkedState';
// import { commonDesktopLinkedState } from 'state/commonLinkedStates';

const commonDesktopLinkedState = new DesktopLinkedState();

const createDesktopNotification = (message, description, onClick = null) => {
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