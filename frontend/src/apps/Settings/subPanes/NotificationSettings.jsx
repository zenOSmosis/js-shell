import React from 'react';
// import Center from '../../../components/Center';
import createDesktopNotification from '../../../utils/desktop/createDesktopNotification';
// import { Switch } from 'antd';

const NotificationSettings = (props = {}) => {
  // const currState = desktopLinkedState.getState();
  // const {contextMenuIsTrapping} = currState;

  return (
    <div>
      [ Test Notification Settings ]

      <button onClick={ (evt) => createDesktopNotification({
        message: 'I am a message',
        description: 'I am a description',
        onClick: null
      })}>Generate Notification</button>

      Audio Notifications<br />

      <hr />

      - Notify when any new client connects<br />
      - Notify when any connected client disconnects<br />
    </div>
  );
};

export default NotificationSettings;