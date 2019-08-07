import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import { XTerm, Terminal } from "react-xterm";
import "react-xterm/node_modules/xterm/dist/xterm.css"

export default class TerminalWindow extends Component {

  componentDidMount() {
    connectTerminal(this._xterm)
  }
  render() {
    const { ...propsRest } = this.props;
    return (
      <Window
        {...propsRest}
      >
        <XTerm 
          addons={['fit', 'winptyCompat', 'attach']}
          ref={ref => this._xterm = ref} 
          style={{
            width: '100%',
            height: '100%'
          }} 
        />
      </Window>
    );
  }

  
}

function connectTerminal(xterm) {
  const term = xterm.getTerminal();
  // No idea what this does
  term.winptyCompatInit();
  // Open the websocket connection to the backend
  const protocol = (window.location.protocol === 'https:') ? 'wss://' : 'ws://';
  const port = ':3002';//window.location.port ? `:${window.location.port}` : '';
  const socketUrl = `${protocol}${window.location.hostname}${port}/shell`;
  console.log('connecting to:', socketUrl)
  const socket = new WebSocket(socketUrl);
  // Attach the socket to the terminal
  socket.onopen = (ev) => { 
    console.log('socket connected')
    term.attach(socket); 
  }

  socket.onerror = (ev) => { 
    console.log('error', ev)
  }
  // Not going to worry about close/error for the websocket
}