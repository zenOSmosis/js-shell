import 'normalize.css/normalize.css';
import 'antd/dist/antd.css';
import './style-antd-overrides.css';
import './style.css';
import './style-scrollbar.css';

import React, { Component } from 'react';
import Panel from './Panel';
// import logo from './logo.svg';
import ContextMenu from 'components/ContextMenu';
import Center from 'components/Center';
import Dock from './Dock';
import FullViewport from 'components/FullViewport';
import Background from 'components/Background';
import Window from 'components/Desktop/Window';
import NoHostConnectionModal from './modals/NoHostConnectionModal';
// import DesktopAppRunConfig from 'DesktopAppRunConfig';
import DesktopLinkedState, { hocConnect } from 'state/DesktopLinkedState';
import socket from 'utils/socket.io';
import config from 'config';
import { notification as antdNotification } from 'antd';
import defaultApps from '../../apps/defaultApps';
console.debug('default apps', defaultApps);

// TODO: Change page title according to active window title

class Desktop extends Component {
  state = {
    wallpaperPaths: [],

    controlUIWindow: null,
    controlUIWindowTitle: null,

    desktopWindows: [],

    contextMenuIsTrapping: config.contextMenuIsTrapping
  };

  // _linkedState = new DesktopLinkedState();

  constructor(props) {
    super(props);
  }

  // TODO: Factor out logic into external handlers
  componentDidMount() {
    // Wallpaper
    this.fetchWallpaperPaths();

    /*
    this._linkedState.setState({
      desktopComponent: this
    });
    */
  }

  createNotification(notification) {
    const { message, description, onClick } = notification;

    antdNotification.open({
      message,
      description,
      onClick
    });
  }

  fetchWallpaperPaths() {
    socket.emit('wallpapers:fetch-wallpaper-paths', null, (wallpaperPaths) => {
      // console.debug('wallpaper paths', wallpaperPaths);

      this.setState({
        wallpaperPaths
      });
    });
  }

  createWindow(props = {}) {
    let desktopWindow;

    if (typeof props.$$typeof !== 'undefined') {
      desktopWindow = props;
    } else {
      // TODO: Differentiate key
      desktopWindow = <Window key={props.title} {...props} />
    }

    let { desktopWindows } = this.state;
    desktopWindows.push(
      <div
        key={desktopWindows.length}
        style={{ position: 'absolute', width: 0, height: 0 }}
      >
        {
          desktopWindow
        }
      </div>
    );

    this.setState({
      desktopWindows
    });
  }

  render() {
    const {desktopWindows} = this.state;

    return (
      <FullViewport className="Desktop">
        <ContextMenu>
          <Background src={config.DESKTOP_DEFAULT_BACKGROUND_URI}>
            <Panel desktop={this} />
              {
                // TODO: Rework window handling
                desktopWindows &&
                desktopWindows.map((desktopWindow) => {
                  return desktopWindow;
                })
              }
            <NoHostConnectionModal />
            <Dock desktop={this} />
          </Background>
        </ContextMenu>
      </FullViewport>
    );
  }
}

export default hocConnect(Desktop, DesktopLinkedState, (updatedState) => {
  console.debug('updated state', updatedState);
});