import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import FullViewportHostConnection from './components/FullViewportHostConnection';
import FileNavigator from './components/FileNavigator';
import FullViewportAppMenu from './components/FullViewportAppMenu';
import FullViewportSystemInformation from './components/FullViewportSystemInformation';
import FullVieportSocketIOInformation from './components/FullViewportSocketIOInformation';
// import RenderObject from './components/RenderObject';
import socket from './utils/socket.io';

class App extends Component {
  state = {
    appMenuOpenCode: -1,
    sysInfoOpenCode: -1,
    socketInfoOpenCode: -1
  };

  openAppMenu() {
    const {appMenuOpenCode} = this.state;
    this.setState({
      appMenuOpenCode: appMenuOpenCode + 1
    });
  }

  openSysInfo() {
    const {sysInfoOpenCode} = this.state;
    this.setState({
      sysInfoOpenCode: sysInfoOpenCode + 1
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

  render() {
    return (
      <div className="App">
          {
            // <img src={logo} className="App-logo" alt="logo" />
          }

          <button onClick={ (evt) => this.openAppMenu() }>Launch App Menu</button>
          <button onClick={ (evt) => this.openSysInfo() }>View System Information</button>
          <button onClick={ (evt) => this.openSocketInfo() }>View Socket.io Information</button>

          <FullViewportAppMenu
            openCode={this.state.appMenuOpenCode}
            onAppSelect={this.onAppSelect}
          />

          <FullViewportSystemInformation
            openCode={this.state.sysInfoOpenCode}
          />

          <FullVieportSocketIOInformation
            openCode={this.state.socketInfoOpenCode}
          />
        
          <FullViewportHostConnection />
          
          {
            // <FileNavigator />
          }
      </div>
    );
  }
}

export default App;
