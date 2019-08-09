import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import { XTerm, Terminal } from "react-xterm";
import "react-xterm/node_modules/xterm/dist/xterm.css"

export default class TerminalWindow extends Component {

  componentDidMount() {
    connectTerminal(this._xterm)
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
    return (
      <Window
        {...propsRest}
        minWidth="740"
        minHeight="440"
        sizeable= "false"
      >
        {
          socketChannelID &&
          <XTerm
            // TODO: Enable support for resize / etc

            // addons={['fit', /*'winptyCompat'*/, 'attach']}
            ref={ref => this._xterm = ref}
            onInput={this._handleInput}
          />
        }
        
      </Window>
    );
  }

  
}