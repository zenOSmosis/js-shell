import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Shape3DTesterWindow from './components/windows/Shape3DTesterWindow';
import SystemInformationWindow from './components/windows/SystemInformationWindow';
import Window from './components/Window';
import FullViewport from './components/FullViewport';
import BackgroundView from './components/BackgroundView';
import FullViewportHostConnection from './components/FullViewportHostConnection';
// import FileNavigator from './components/FileNavigator';
import FullViewportAppMenu from './components/FullViewportAppMenu';
import FullVieportSocketIOInformation from './components/FullViewportSocketIOInformation';
// import RenderObject from './components/RenderObject';
import socket from './utils/socket.io';

class App extends Component {
  state = {
    appMenuOpenCode: -1,
    socketInfoOpenCode: -1,

    wallpaperPaths: [],

    desktopWindows: []
  };

  componentDidMount() {
    this.fetchWallpaperPaths();
  }

  fetchWallpaperPaths() {
    socket.emit('wallpapers:fetch-wallpaper-paths', null, (wallpaperPaths) => {
      console.debug('wallpaper paths', wallpaperPaths);

      this.setState({
        wallpaperPaths
      });
    });
  }

  openAppMenu() {
    const {appMenuOpenCode} = this.state;
    this.setState({
      appMenuOpenCode: appMenuOpenCode + 1
    });
  }

  openSocketInfo() {
    const {socketInfoOpenCode} = this.state;
    this.setState({
      socketInfoOpenCode: socketInfoOpenCode + 1
    });
  }

  onAppSelect = (app) => {
    console.debug(app);
  }

  createWindow() {
    const desktopWindow = {};
    let {desktopWindows} = this.state;
    desktopWindows.push(desktopWindow);

    this.setState({
      desktopWindows
    });
  }

  render() {
    return (
      <FullViewport>
        <BackgroundView className="App">
            {
              // <img src={logo} className="App-logo" alt="logo" />
            }

            <button onClick={ evt => this.createWindow() }>+</button>

            <Shape3DTesterWindow />
            <SystemInformationWindow />

            {
              this.state.desktopWindows.map((desktopWindow, idx) => {
                return (
                  <Window key={idx}>
                    [Window]
                  </Window>
                )
              })
            }

            <button onClick={ (evt) => this.openAppMenu() }>Launch App Menu</button>
            <button onClick={ (evt) => this.openSocketInfo() }>View Socket.io Information</button>

            {
              this.state.wallpaperPaths.length > 0 &&
              <img src={`http://localhost:3001/files?filePath=${this.state.wallpaperPaths[0]}`} />
            }

            <FullViewportAppMenu
              openCode={this.state.appMenuOpenCode}
              onAppSelect={this.onAppSelect}
            />

            <FullVieportSocketIOInformation
              openCode={this.state.socketInfoOpenCode}
            />
          
            <FullViewportHostConnection />
            
            {
              // <FileNavigator />
            }
        </BackgroundView>
      </FullViewport>
    );
  }
}

export default App;
