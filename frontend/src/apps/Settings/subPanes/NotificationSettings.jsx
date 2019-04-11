import React from 'react';
// import Center from '../../../components/Center';
import {desktopLinkedState} from '../../../state/DesktopLinkedState';
// import { Switch } from 'antd';

const NotificationSettings = (props = {}) => {
  // const currState = desktopLinkedState.getState();
  // const {contextMenuIsTrapping} = currState;

  return (
    <div>
      [ Test Notification Settings ]

      <button onClick={ (evt) => desktopLinkedState.setState({
        lastNotification: {
          message: 'I am a message',
          description: 'I am a description',
          onClick: null
        }
      })}>Generate Notification</button>

      Audio Notifications
    </div>
  );
};

export default NotificationSettings;