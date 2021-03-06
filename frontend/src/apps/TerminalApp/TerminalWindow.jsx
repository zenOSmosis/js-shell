import React, { Component } from 'react';
import Window, { EVT_RESIZE } from 'components/Desktop/Window';
import XTerm from 'components/XTerm';
// import { XTerm, /* Terminal */ } from 'react-xterm';
// import 'react-xterm/node_modules/xterm/dist/xterm.css';

import socket from 'utils/socket.io';
import socketAPIQuery from 'utils/socketAPI/socketAPIQuery';
import { SOCKET_API_ROUTE_CREATE_XTERM_SOCKET_CHANNEL } from 'shared/socketAPI/socketAPIRoutes';
import SocketChannel from 'shared/socketAPI/SocketChannel';

export default class TerminalWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socketChannelId: null
    };

    this._window = null;
    this._xterm = null;
    this._socketChannel = null;

    this._initSocketChannel();
  }

  async _initSocketChannel() {
    try {
      const { socketChannelId } = await socketAPIQuery(SOCKET_API_ROUTE_CREATE_XTERM_SOCKET_CHANNEL);

      this._socketChannel = new SocketChannel(socket, socketChannelId);

      this.setState({
        socketChannelId
      });

      this._connectTerminal();
    } catch (exc) {
      throw exc;
    }
  }

  componentDidMount() {
    // this._connectTerminal();

    this._window.on(EVT_RESIZE, () => {
      this._xterm.fit();
    });
  }

  componentWillUnmount() {
    // Disconnect from the socket channel
    this._socketChannel.disconnect();
  }

  _connectTerminal() {
    this._socketChannel.on('data', (data) => {
      if (!this._xterm) {
        // TODO: Fix potential HMR-related issue by attempting to establish a
        // new terminal if we ever get here

        console.error('No xterm available when connecting terminal');
        return;
      }

      this._xterm.write(this._socketChannel.ab2str(data));
    });
  }

  _handleKeyboardInput = (data) => {
    this._socketChannel.write(this._socketChannel.str2ab(data));
  };

  render() {
    const { ...propsRest } = this.props;
    const { socketChannelId } = this.state;
    return (
      <Window
        {...propsRest}
        // minWidth="740"
        // minHeight="440"
        // isResizable= "false"
        ref={window => this._window = window}
      >
        {
          socketChannelId &&
          <XTerm
            // TODO: Enable support for resize / etc

            // addons={['fit', /*'winptyCompat'*/, 'attach']}
            ref={ref => this._xterm = ref}
            onInput={this._handleKeyboardInput}
          />
        }
      </Window>
    );
  }
}