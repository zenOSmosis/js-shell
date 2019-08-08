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
      socketChannelID: null
    };

    this._window = null;
    this._xterm = null;
    this._socketChannel = null;

    this._initSocketChannel();
  }

  async _initSocketChannel() {
    try {
      const { socketChannelID } = await socketAPIQuery(SOCKET_API_ROUTE_CREATE_XTERM_SOCKET_CHANNEL);

      this._socketChannel = new SocketChannel(socket, socketChannelID);

      this.setState({
        socketChannelID
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
    console.warn('TODO: Handle forcing of terminal to disconnect');
  }

  _connectTerminal() {
    // TODO: Fix this
    // No idea what this does
    // term.winptyCompatInit();

    /*
    // Open the websocket connection to the backend
    const protocol = (window.location.protocol === 'https:') ? 'wss://' : 'ws://';
    const port = ':3002';//window.location.port ? `:${window.location.port}` : '';
    const socketUrl = `${protocol}${window.location.hostname}${port}/shell`;
    console.debug('connecting to:', socketUrl)
    const socket = new WebSocket(socketUrl);
    
    // Attach the socket to the terminal
    socket.onopen = (ev) => { 
      console.debug('socket connected')
      term.attach(socket); 
    }
  
    socket.onerror = (ev) => { 
      console.debug('error', ev)
    }
    */

    this._socketChannel.on('data', (data) => {
      this._xterm.write(this._socketChannel.ab2str(data));
    });
  }

  _handleInput = (data) => {
    this._socketChannel.write(this._socketChannel.str2ab(data));
  };

  render() {
    const { ...propsRest } = this.props;
    const { socketChannelID } = this.state;
    return (
      <Window
        {...propsRest}
        ref={window => this._window = window}
      >
        {
          socketChannelID &&
          <XTerm
            // addons={['fit', /*'winptyCompat'*/, 'attach']}
            ref={ref => this._xterm = ref}
            onInput={this._handleInput}
          />
        }
        
      </Window>
    );
  }
}