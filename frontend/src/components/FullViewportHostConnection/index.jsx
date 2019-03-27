import React, {Component} from 'react';
import FullViewportPanel from '../FullViewportPanel';
import socket from '../../utils/socket.io';

export default class FullViewportHostConnection extends Component {
  state = {
    isConnected: false
  };

  socketConnectHandler = () => {
    this.setState({
      isConnected: socket.connected
    }, () => {
      if (!socket.connected) {
        this._fullViewportPanel.open();
      } else {
        this._fullViewportPanel.close();
      }
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

  render() {
    return (
      <FullViewportPanel
        ref={ c => this._fullViewportPanel = c }
        uicloseable={false}
        {...this.props}
      >
        The application is currently awaiting a host Socket.io connection.
      </FullViewportPanel>
    )
  }
}