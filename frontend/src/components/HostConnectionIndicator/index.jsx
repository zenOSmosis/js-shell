import React, {Component} from 'react';
import socket from './../../utils/socket.io';

export default class HostConnectionIndicator extends Component {
  state = {
    isConnected: false
  };

  socketConnectHandler = () => {
    this.setState({
      isConnected: socket.connected
    }); 
  }

  componentDidMount() {
    this.socketConnectHandler();

    socket.on('connect', this.socketConnectHandler);
    socket.on('disconnect', this.socketConnectHandler);
  }

  componentWillUnmount() {
    socket.off('connect', this.socketConnectHandler);
    socket.off('disconnect', this.socketConnectHandler);
  }

  render () {
    return (
      <div>
        HostConnectionIndicator

        <div>
          {this.state.isConnected ? 'CONNECTED' : 'DISCONNECTED'}
        </div>
      </div>
    );
  }
}