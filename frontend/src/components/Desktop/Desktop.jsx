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
import Background from './Background';
import fetchWallpaperPaths from 'utils/desktop/fetchWallpaperPaths';
import { BrowserRouter as Router } from 'react-router-dom';

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
      <Router>
        <FullViewport className="zd-desktop">
          <ContextMenu>
            <Background>

              {
                // Top Panel
              }
              <Panel desktop={this} />

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

              <WindowDrawLayer />

              {
                // Bottom Dock
              }
              <Dock desktop={this} />

            </Background>
          </ContextMenu>
        </FullViewport>
      </Router>
    );
  }
}