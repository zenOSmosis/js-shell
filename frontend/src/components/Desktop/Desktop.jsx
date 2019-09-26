import 'normalize.css/normalize.css';
import 'antd/dist/antd.css';
import './style-antd-overrides.scss';
import './style.scss';
import './style-scrollbar.scss';

import React, { Component } from 'react';
import NativeWindowTitleController from './NativeWindowTitleController';
import FullscreenProvider from 'react-full-screen';
import Panel from './Panel';
import Dock from './Dock';
import Notifications from './Notifications';
import DesktopKeyboardInterruptProvider from './DesktopKeyboardInterruptProvider';
import Center from '../Center';
import ContextMenuProvider from 'components/ContextMenuProvider';
import FullViewport from 'components/FullViewport';
import DesktopBackground from './DesktopBackground';
import VersionLabel from './VersionLabel';
import FileChooserOverlayContext from './FileChooserOverlayContext';
// import Login from './Login';
// import URLRedirector from './URLRedirector';
// import AppRouteController from './AppRouteController';
// import { BrowserRouter as Router } from 'react-router-dom';

// import LinkedStateComponent from 'state/LinkedStateComponent';
import DesktopLinkedState, { hocConnect } from 'state/DesktopLinkedState';
import SocketLinkedState, {
  STATE_SOCKET_AUTHENTICATION_ERROR
} from 'state/SocketLinkedState';
import GUIProcessRenderer from './GUIProcessRenderer';

// Registers default Shell Desktop apps
// TODO: If refactoring this to another location, update the reference to that
// location in apps/defaultApps.js comments
import 'apps/defaultApps';

class Desktop extends Component {
  render() {
    const {
      [STATE_SOCKET_AUTHENTICATION_ERROR]: socketAuthenticationError,
      isFullScreenRequested
    } = this.props;

    if (socketAuthenticationError) {
      return (
        <FullViewport>
          <Center>
            <div>
              <h1>There has been a problem trying to authenticate.</h1>

              <div>
                Server error:<br />
                {
                  socketAuthenticationError
                }
              </div>

              <button onClick={evt => window.location.reload()}>Try Again</button>
            </div>
          </Center>
        </FullViewport>
      )
    }

    return (
      <div ref={c => this._el = c}>
        <NativeWindowTitleController />
        <DesktopKeyboardInterruptProvider>
          <FullscreenProvider
            enabled={isFullScreenRequested}
          // onChange={isFullScreenRequested => this.setState({isFullScreenRequested})}
          >
            <FullViewport>
              <FileChooserOverlayContext>

                {
                  // <URLRedirector /> 
                }

                <ContextMenuProvider>

                  <DesktopBackground ref={c => this._desktopBackground = c}>

                    {
                      // Top Panel
                    }
                    <Panel />

                    <Notifications />

                    {
                      // TODO: Implement DrawersLayer as a separate component
                      // @see https://ant.design/components/drawer/
                      /*
                      <Drawer
                        mask={false}
                        bodyStyle={{backgroundColor: 'rgba(0,0,0,.4)'}}
                        onContextMenu={ (evt) => alert('context') }
                        placement="right"
                        visible={true}
                      >
                        Well, hello
                      </Drawer>
                      */
                    }

                    {
                      // Binds windows to URL location; sets page title
                      // <AppRouteController />
                    }

                    <GUIProcessRenderer />

                    <VersionLabel />

                    {
                      // Bottom Dock
                    }
                    <Dock />

                  </DesktopBackground>
                  {
                    /*
                    !isLoggedIn && <Login />
                    */
                  }

                </ContextMenuProvider>
              </FileChooserOverlayContext>
            </FullViewport>
          </FullscreenProvider>
        </DesktopKeyboardInterruptProvider>
      </div>
    );
  }
}

const DesktopLinkedStateDesktop = hocConnect(Desktop, DesktopLinkedState, (updatedState) => {
  const { isFullScreenRequested } = updatedState;

  const filteredState = {};

  if (isFullScreenRequested !== undefined) {
    filteredState.isFullScreenRequested = isFullScreenRequested;
  }

  if (Object.keys(filteredState).length) {
    return filteredState;
  }
});

export default hocConnect(DesktopLinkedStateDesktop, SocketLinkedState);