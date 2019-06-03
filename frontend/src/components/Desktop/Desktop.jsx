import 'normalize.css/normalize.css';
import 'antd/dist/antd.css';
import './style-antd-overrides.css';
import './style.css';
import './style-scrollbar.css';

import React, { Component } from 'react';
import Panel from './Panel';
import Dock from './Dock';
import Notifications from './Notifications';
import WindowDrawLayer from './WindowDrawLayer';
import ContextMenu from 'components/ContextMenu';
import FullViewport from 'components/FullViewport';
import DesktopBackground from './DesktopBackground';
// import URIRedirector from './URIRedirector';
// import AppRouteController from './AppRouteController';
// import { BrowserRouter as Router } from 'react-router-dom';

// import LinkedStateComponent from 'state/LinkedStateComponent';
import DesktopLinkedState, { hocConnect } from 'state/DesktopLinkedState';
// import ClientGUIProcesses from './ClientGUIProcesses';

import $ from 'jquery';

class Desktop extends Component {
  componentDidMount() {
    this._handleFocusUpdate();
  }

  componentDidUpdate() {
    this._handleFocusUpdate();
  }

  _handleFocusUpdate = () => {
    const {isFocused} = this.props;

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
    return (
      <div ref={c => this._el = c}>

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
                  <div style={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      color: 'rgba(255,255,255,.8)'
                    }}
                  >
                    Linux Shell Evaluation<br />
                    Copyright &copy; 2019 zenOSmosis<br />
                    TODO: Add licensing information<br />
                    TODO: Add current git hash, etc.<br />
                  </div>
                }

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

                {
                  // <ClientGUIProcesses onOutsideProcessInteract={ evt => console.debug('Outside process interact', evt) } />
                }
                

                {
                  // Renders windows
                }
                <WindowDrawLayer onDirectInteract={ evt => console.debug('Desktop Interact', evt) } />

                {
                  // Bottom Dock
                }
                <Dock />

              </div>

            </DesktopBackground>

          </ContextMenu>

        </FullViewport>

      </div>
    );
  }
}

export default hocConnect(Desktop, DesktopLinkedState, (updatedState) => {
  const {isFocused} = updatedState;

  let filteredState = {};

  if (typeof isFocused !== 'undefined') {
    filteredState.isFocused = isFocused;
  }

  if (Object.keys(filteredState).length) {
    return filteredState;
  }
});