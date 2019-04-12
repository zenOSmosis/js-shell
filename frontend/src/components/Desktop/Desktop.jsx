import 'antd/dist/antd.css';
import './style-antd-overrides.css';
import './style.css';
import './style-scrollbar.css';

import React, { Component } from 'react';
import Panel from './Panel';
// import logo from './logo.svg';
import ContextMenu from './../../components/ContextMenu';
import Dock from './Dock';
import FullViewport from './../../components/FullViewport';
import Background from './../../components/Background';
import Window from './../../components/Desktop/Window';
import NoHostConnectionModal from './modals/NoHostConnectionModal';
// import DesktopAppRunConfig from './DesktopAppRunConfig';
import DesktopLinkedState, { EVT_BROADCAST_STATE_UPDATE } from '../../state/DesktopLinkedState';
import socket from '../../utils/socket.io';
import config from '../../config';
import { notification } from 'antd';
import 'normalize.css/normalize.css';
// import 'bootstrap/dist/css/bootstrap.css'; // TODO: Remove bootstrap

import defaultApps from '../../apps/defaultApps';
console.debug('default apps', defaultApps);

// TODO: Change page title according to active window title

export default class Desktop extends Component {
  state = {
    wallpaperPaths: [],

    controlUIWindow: null,
    controlUIWindowTitle: null,

    desktopWindows: [],

    contextMenuIsTrapping: config.contextMenuIsTrapping
  };

  constructor(props) {
    super(props);

    this._desktopLinkedState = new DesktopLinkedState();
    this._desktopLinkedState.setState({
      desktop: this
    });
  }

  componentDidMount() {
    this.fetchWallpaperPaths();

    this._desktopLinkedState.on(EVT_BROADCAST_STATE_UPDATE, (updatedState) => {
      const { contextMenuIsTrapping } = updatedState;

      if (typeof contextMenuIsTrapping !== 'undefined') {
        this.setState({
          contextMenuIsTrapping
        }, () => {
          this.createNotification({
            message: `Native context-menu trapping is ${contextMenuIsTrapping ? 'enabled' : 'disabled'}`,
            // description: 'This is the description',
            /*
            onClick: () => {
              alert('You clicked the notification');
            }
            */
          })
        });
      }

      const { lastNotification } = updatedState;
      if (typeof lastNotification !== 'undefined') {
        this.createNotification(lastNotification);
      }
    });
  }

  createNotification(options) {
    const { message, description, onClick } = options;

    notification.open({
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

  // TODO: Remove
  /*
  onAppSelect = (app) => {
    console.debug(app);
  }
  */

  /*
  importAppConfiguration(runConfig) {

    const {icon, title, mainWindow} = processInfo;

    const runConfig = new DesktopAppRunConfig(this);

    if (icon) {
      runConfig.setIcon(icon);
    }

    if (title) {
      runConfig.setTitle(title);
    }

    if (mainWindow) {
      runConfig.addWindow(mainWindow);
    }

    return runConfig;
  }
  */

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
        key={this.state.desktopWindows.length}
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
    return (
      <FullViewport className="Desktop">
        <ContextMenu
          isTrapping={this.state.contextMenuIsTrapping}
        >
          <Background src={config.DESKTOP_DEFAULT_BACKGROUND_URI}>
            <Panel desktop={this} />
            <div>
              {
                this.state.desktopWindows.map((desktopWindow) => {
                  return desktopWindow;
                })
              }
            </div>

            <NoHostConnectionModal />
            <Dock desktop={this} />
          </Background>
        </ContextMenu>
      </FullViewport>
    );
  }
}