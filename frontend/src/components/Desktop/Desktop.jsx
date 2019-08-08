import 'normalize.css/normalize.css';
import 'antd/dist/antd.css';
import './style-antd-overrides.css';
import './style.css';
import './style-scrollbar.css';

import React, { Component } from 'react';
import Fullscreen from 'react-full-screen';
import Panel from './Panel';
import Dock from './Dock';
import Notifications from './Notifications';
import ContextMenu from 'components/ContextMenu';
import FullViewport from 'components/FullViewport';
import DesktopBackground from './DesktopBackground';
import VersionLabel from './VersionLabel';
import Login from './Login';
// import URIRedirector from './URIRedirector';
// import AppRouteController from './AppRouteController';
// import { BrowserRouter as Router } from 'react-router-dom';

// import LinkedStateComponent from 'state/LinkedStateComponent';
import DesktopLinkedState, { hocConnect, EVT_LINKED_STATE_UPDATE } from 'state/DesktopLinkedState';
import AppRuntimeRenderProvider from './AppRuntimeRenderProvider';

// Registers default Shell Desktop apps
// TODO: If refactoring this to another location, update the reference to that
// location in apps/defaultApps.js comments
import 'apps/defaultApps';

import $ from 'jquery';

class Desktop extends Component {
  componentDidMount() {
    this._handleFocusUpdate();
  }

  componentDidUpdate() {
    this._handleFocusUpdate();

  }

  _handleFocusUpdate = () => {
    const { isFocused } = this.props;

    if (typeof isFocused !== 'undefined') {
      const $body = $(window.document.body);

      if (!isFocused) {
        $body.addClass('blur');
      } else {
        $body.removeClass('blur');
      }
    }
  }

  render() {
    const { isFullScreenRequested } = this.props;

    return (
      <div ref={c => this._el = c}>
        <Fullscreen
          enabled={isFullScreenRequested}
          // onChange={isFullScreenRequested => this.setState({isFullScreenRequested})}
        >
          <FullViewport>

            {
              // <URIRedirector /> 
            }

            <ContextMenu>

              <DesktopBackground ref={c => this._desktopBackground = c}>

                <div ref={c => this._elDesktopInteractLayer = c} style={{ width: '100%', height: '100%' }}>

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
                    // Binds windows to URI location; sets page title
                    // <AppRouteController />
                  }

                  <AppRuntimeRenderProvider />

                  <VersionLabel />

                  {
                    // Bottom Dock
                  }
                  <Dock />

                </div>

              </DesktopBackground>
              {
                !isLoggedIn && <Login />
              }


            </ContextMenu>

          </FullViewport>
        </Fullscreen>
      </div>
    );
  }
}

export default hocConnect(Desktop, DesktopLinkedState, (updatedState) => {
  const { isFocused, isFullScreenRequested } = updatedState;

  let filteredState = {};

  if (typeof isLoggedIn !== 'undefined') {
    filteredState.isLoggedIn = isLoggedIn;
  }

  if (typeof isFocused !== 'undefined') {
    filteredState.isFocused = isFocused;
  }

  if (typeof isFullScreenRequested !== 'undefined') {
    filteredState.isFullScreenRequested = isFullScreenRequested;
  }

  if (Object.keys(filteredState).length) {
    return filteredState;
  }
});