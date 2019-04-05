import React, {Component} from 'react';
import { Modal } from 'antd';
import socket from '../../../utils/socket.io';

export default class NoHostConnectionModal extends Component {
  state = { visible: false }

  componentDidMount() {
    this.socketConnectHandler();

    socket.on('connect', this.socketConnectHandler);
    socket.on('disconnect', this.socketConnectHandler);
  }

  componentWillUnmount() {
    socket.off('connect', this.socketConnectHandler);
    socket.off('disconnect', this.socketConnectHandler);
  }

  socketConnectHandler = () => {
    this.setState({
      visible: !socket.connected
    });
  }

  render() {
    return (
      <Modal
        title="No host connection"
        visible={this.state.visible}
      >
        <p>Trying to establish connection to the host.</p>
      </Modal>
    );
  }
}