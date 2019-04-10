import React, { Component } from 'react';
import Panel from './Panel';
// import logo from './logo.svg';
import 'normalize.css/normalize.css';
import 'bootstrap/dist/css/bootstrap.css';
// import * as Blueprint from '../toolkits/Blueprint';
import 'antd/dist/antd.css';
import './style.css';
import './style-scrollbar.css';
import ContextMenu from './../../components/ContextMenu';
import Dock from './Dock';
import BackgroundSelectionWindow from './windows/BackgroundSelectionWindow';
import SystemInformationWindow from './../../components/Desktop/windows/SystemInformationWindow';
import FullViewport from './../../components/FullViewport';
import Background from './../../components/Background';
import Window from './../../components/Desktop/Window';
import NoHostConnectionModal from './modals/NoHostConnectionModal';
import socket from '../../utils/socket.io';

export default class Desktop extends Component {
  state = {
    appMenuOpenCode: -1,
    socketInfoOpenCode: -1,

    wallpaperPaths: [],

    controlUIWindow: null,
    controlUIWindowTitle: null,

    desktopWindows: []
  };

  componentDidMount() {
    this.fetchWallpaperPaths();

    // this.createWindow(<Shape3DTesterWindow />);
    this.createWindow(<BackgroundSelectionWindow />);
  }

  fetchWallpaperPaths() {
    socket.emit('wallpapers:fetch-wallpaper-paths', null, (wallpaperPaths) => {
      // console.debug('wallpaper paths', wallpaperPaths);

      this.setState({
        wallpaperPaths
      });
    });
  }

  onAppSelect = (app) => {
    console.debug(app);
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
        key={this.state.desktopWindows.length}
        style={{position: 'absolute', width: 0, height: 0}}
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

  createSystemInformationWindow() {
    let desktopWindow = <SystemInformationWindow />
    this.createWindow(desktopWindow);
  }

  render() {
    return (
      <FullViewport className="Desktop">
        <ContextMenu
          isTrapping={false}
        >
          {
            // TODO: Remove hardcoded src
          }
          <Background src={`http://localhost:3001/files?filePath=${this.state.wallpaperPaths[0]}`}>
            <Panel desktop={this} />

            
            
            {
              // <img src={logo} className="App-logo" alt="logo" />
            }

            <div>
              {
                this.state.desktopWindows.map((desktopWindow) => {
                  return desktopWindow;
                })
              }
              
              {
                /*
                <XTermWindow />
                <AppMenuWindow />
                <VideoPlayerWindow />
                <WebampPlayer />
                <HelloWorldWindow />
                <SystemInformationWindow />
                <WindowManager />
                */
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