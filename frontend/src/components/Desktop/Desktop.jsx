import 'normalize.css/normalize.css';
import 'antd/dist/antd.css';
import './style-antd-overrides.css';
import './style.css';
import './style-scrollbar.css';

import React, { Component } from 'react';
import Panel from './Panel';
import Dock from './Dock';
import WindowsLayer from './WindowsLayer';
import ContextMenu from 'components/ContextMenu';
import FullViewport from 'components/FullViewport';
import Background from 'components/Background';
import NoHostConnectionModal from './modals/NoHostConnectionModal'; // TODO: Remove
import socket from 'utils/socket.io';
import config from 'config';

// TODO: Change page title according to active window title

export default class Desktop extends Component {
  state = {
    wallpaperPaths: []
  };

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

  // TODO: Move to another module
  fetchWallpaperPaths() {
    socket.emit('wallpapers:fetch-wallpaper-paths', null, (wallpaperPaths) => {
      // console.debug('wallpaper paths', wallpaperPaths);

      this.setState({
        wallpaperPaths
      });
    });
  }

  render() {
    return (
      <FullViewport className="zd-desktop">
        <ContextMenu>
          <Background src={config.DESKTOP_DEFAULT_BACKGROUND_URI}>
            
            {
              // Top Panel
            }
            <Panel desktop={this} />

            {
              // TODO: Implement NotificationsLayer
            }

            {
              // TODO: Implement DrawersLayer
            }

            <WindowsLayer />
            
            {
              // TODO: Rework
            }
            <NoHostConnectionModal />

            {
              // Bottom Dock
            }
            <Dock desktop={this} />

          </Background>
        </ContextMenu>
      </FullViewport>
    );
  }
}