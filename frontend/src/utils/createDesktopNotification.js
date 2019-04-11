import {desktopLinkedState} from '../state/DesktopLinkedState';

const createDesktopNotification = (message, description, onClick) => {
  desktopLinkedState.setState({
    lastNotification: {
      message,
      description,
      onClick
    }
  });
};

export default createDesktopNotification;