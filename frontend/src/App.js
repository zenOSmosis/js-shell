import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AppLauncher from './components/AppLauncher';
import AppMenu from './components/AppMenu';
import HostConnectionIndicator from './components/HostConnectionIndicator';
import FileNavigator from './components/FileNavigator';
import GPUSelector from './components/GPUSelector';
import SystemMonitor from './components/SystemMonitor';
import NetworkPortList from './components/NetworkPortList';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <HostConnectionIndicator />
          <AppMenu />
          <AppLauncher />
          <FileNavigator />
          <GPUSelector />
          <SystemMonitor />
          <NetworkPortList />
        </header>
      </div>
    );
  }
}

export default App;
