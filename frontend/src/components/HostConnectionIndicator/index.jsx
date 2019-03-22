import React, {Component} from 'react';
import socket from './../../utils/socket.io';

console.debug(socket);

export default class HostConnectionIndicator extends Component {
  render () {
    return (
      <div>
        HostConnectionIndicator
      </div>
    );
  }
}