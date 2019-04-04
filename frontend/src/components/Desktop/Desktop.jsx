import React, { Component } from 'react';
import Panel from './Panel';
// import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import AppMenuWindow from './../../components/Desktop/windows/AppMenuWindow';
import Center from './../../components/Center';
import ContextMenu from './../../components/ContextMenu';
import SystemInformationWindow from './../../components/Desktop/windows/SystemInformationWindow';
import WindowManager from './../../components/Desktop/windows/WindowManager';
import FullViewport from './../../components/FullViewport';
import Background from './../../components/Background';
import FullViewportHostConnection from './../../components/FullViewportHostConnection';
// import FileNavigator from './../../components/FileNavigator';
import FullViewportAppMenu from './../../components/FullViewportAppMenu';
import FullVieportSocketIOInformation from './../../components/FullViewportSocketIOInformation';
// import RenderObject from './../../components/RenderObject';
import Window from './../../components/Desktop/Window';
import HelloWorldWindow from './../../components/Desktop/windows/HelloWorldWindow';
import XTermWindow from './../../components/Desktop/windows/XTermWindow';
// import WebAmpPlayer from './../../components/Desktop/windows/WebampPlayer';
import VideoPlayerWindow from './../../components/Desktop/windows/VideoPlayerWindow';
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
      desktopWindow = <Window {...props} /> 
    }
    
    let { desktopWindows } = this.state;
    desktopWindows.push(desktopWindow);

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
      <FullViewport className="App">
        <ContextMenu>
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
                <Shape3DTesterWindow />
                <SystemInformationWindow />
                <WindowManager />
                */
              }


              <FullViewportHostConnection />

              {
                // <FileNavigator />
              }
            </div>

            <Center>
              Hello
            </Center>

          </Background>
        </ContextMenu>
      </FullViewport>
    );
  }
}