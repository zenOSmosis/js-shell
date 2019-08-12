import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import { XTerm, Terminal } from "react-xterm";
import "react-xterm/node_modules/xterm/dist/xterm.css"

export default class TerminalWindow extends Component {

  componentDidMount() {
    connectTerminal(this._xterm)
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
            onInput={this._handleKeyboardInput}
          />
        }
      </Window>
    );
  }

  
}