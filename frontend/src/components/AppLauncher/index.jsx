import React, {Component} from 'react';
import sysCommand from './../../utils/sysCommand';

export default class AppLauncher extends Component {
  render () {
    return (
      <div>
        AppLauncher

        <button onClick={ (evt) => sysCommand(
          'exo-open',
          ['--launch', 'TerminalEmulator'], {
          linuxGPUNumber: 0
        }) }>Launch Terminal</button>

        <button onClick={ (evt) => sysCommand(
          '/usr/bin/vlc',
          [], {
          linuxGPUNumber: 0
        }) }>Launch VLC</button>
      </div>
    );
  }
}