import 'normalize.css/normalize.css';
import 'antd/dist/antd.css';
import './style-antd-overrides.css';
import './style.css';
import './style-scrollbar.css';

import React, { Component } from 'react';
import Fullscreen from "react-full-screen";
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
  state={
    isFull: false,
    isLoggedIn: false
  }

  constructor(props = {}) {
    super();

    this._desktopLinkedState = new DesktopLinkedState();
    this._desktopLinkedState.on(EVT_LINKED_STATE_UPDATE, (updatedState) => {
  console.log('EVT_LINKED_STATE_UPDATE', updatedState)
      const { isLoggedIn } = updatedState;
      this.setState({isLoggedIn});
    });
  }


  

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
    const {isLoggedIn} = this.state;
    return (
      <div ref={c => this._el = c}>
        <Fullscreen
          enabled={this.state.isFull}
          onChange={isFull => this.setState({isFull})}
        >
          <FullViewport>

            {
              // <URIRedirector /> 
            }

            <ContextMenu>

              <DesktopBackground ref={c => this._desktopBackground = c} className={isLoggedIn ? '' : 'blurred'} >
                {isLoggedIn && (
                  <div ref={c => this._elDesktopInteractLayer = c} style={{ width: '100%', height: '100%' }}>

                    {
                      // Top Panel
                    }
                    <Panel onFullScreenToggle={()=>this.setState({isFull:!this.state.isFull})} />

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
                )}

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
  const { isFocused, isLoggedIn } = updatedState;
  let filteredState = {};

  if (typeof isLoggedIn !== 'undefined') {
    filteredState.isLoggedIn = isLoggedIn;
  }

  if (typeof isFocused !== 'undefined') {
    filteredState.isFocused = isFocused;
  }

  if (Object.keys(filteredState).length) {
    return filteredState;
  }
});