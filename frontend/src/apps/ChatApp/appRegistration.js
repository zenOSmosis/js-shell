import React from 'react';
import { EVT_EXIT } from 'process/ClientProcess';
import registerApp from 'utils/desktop/registerApp';
import ChatAppWindow from './ChatAppWindow';
import ChatIcon from 'components/componentIcons/ChatIcon';
import P2PLinkedState from 'state/P2PLinkedState';

export default registerApp({
  title: 'Chat',
  view: (props) => {
    return (
      <ChatAppWindow {...props} />
    );
  },
  cmd: (appRuntime) => {
    let p2pLinkedState = new P2PLinkedState();
    appRuntime.on(EVT_EXIT, () => {
      p2pLinkedState.destroy();
      p2pLinkedState = null;
    });

    appRuntime.setState({
      p2pLinkedState
    });
  },
  allowMultipleWindows: true,
  iconView: () => <ChatIcon />
});