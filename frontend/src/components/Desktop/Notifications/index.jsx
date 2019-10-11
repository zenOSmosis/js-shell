import React, { Fragment } from 'react';
import DesktopLinkedState, { hocConnect } from 'state/DesktopLinkedState';
import { notification } from 'antd';

/**
 * An "invisible" component, solely responsible for generating Desktop
 * notifications via hocConnect.
 */
const Notifications = () => {
  return (
    <Fragment />
  );
};

export default hocConnect(Notifications, DesktopLinkedState, (updatedState) => {
  const { lastNotification } = updatedState;

  if (lastNotification) {
    const { message, description, onClick } = lastNotification;

    if (message === null && description === null) {
      return;
    }

    notification.open({
      message,
      description,
      onClick: () => {
        if (typeof onClick === 'function') {
          return onClick();
        } else {
          console.debug('notification click', lastNotification);
        }
      }
    })
  }
});