import {desktopLinkedState} from './.common';

const createDesktopNotification = (notification) => {
  const {message, description, onClick} = notification;

  desktopLinkedState.setState({
    lastNotification: {
      message,
      description,
      onClick
    }
  });
};

export default createDesktopNotification;