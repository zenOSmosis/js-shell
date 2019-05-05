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
import Background from './Background';
import NoHostConnectionModal from './modals/NoHostConnectionModal'; // TODO: Remove
import fetchWallpaperPaths from 'utils/desktop/fetchWallpaperPaths';
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
  async fetchWallpaperPaths() {
    try {
      const wallpaperPaths = await fetchWallpaperPaths();

      this.setState({
        wallpaperPaths
      });
    } catch (exc) {
      throw exc;
    }
  }

  render() {
    return (
      <FullViewport className="zd-desktop">
        <ContextMenu>
          <Background>
            
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