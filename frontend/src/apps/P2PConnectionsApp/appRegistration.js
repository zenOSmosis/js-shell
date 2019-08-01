import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import P2PConnectionsWindow from './P2PConnectionsWindow';
import config from 'config';
import AppRuntime from 'core/AppRuntime';
import Window from 'components/Desktop/Window';

export default registerApp({
  title: 'P2P Connections',
  mainView: (props) => {
    return (
      <P2PConnectionsWindow {...props} />
    )
  },
  iconSrc: `${config.HOST_ICON_URI_PREFIX}people-connection/people-connection.svg`,
  cmd: (app) => {
    app.handleUserClick = (user) => {
      console.warn('TODO: Handle user click', user);
      // alert('TODO: Launch user chat with user');

      /*
      // Launch chat window
      new AppRuntime({
        title: `Chat w/ ${user.nickname}`,
        mainView: (props) => {
          return (
            <Window
              {...props}
            >
              <div>I am a chat!</div>
            </Window>
          );
        },
        // TODO: Make this the user's avatar
        iconSrc: `${config.HOST_ICON_URI_PREFIX}people-connection/people-connection.svg`
      });
      */
    };
  }
});