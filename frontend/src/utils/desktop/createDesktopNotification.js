import { commonDesktopLinkedState } from './.common';

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