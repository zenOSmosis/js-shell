import React, {Component} from 'react';
import Window from '../../Window';
// import { Terminal } from 'xterm';

// import * as fit from './xterm/lib/addons/fit/fit';
// Terminal.applyAddon(fit);
 
// import('./xterm/dist/xterm.css');

/*
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="" />
    <script src="node_modules/xterm/dist/xterm.js"></script> 
  </head>
  <body>
    <div id="terminal"></div>
    <script>
      var term = new Terminal();
      term.open(document.getElementById('terminal'));
      term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    </script> 
  </body>
</html>
*/

export default class XTerm extends Component {
  constructor(props) {
    super(props);

    // this.xterm = new Terminal();  // Instantiate the terminal
    //                 // Use the `fit` method, provided by the `fit` addon
  }

  componentDidMount() {
    // this.xterm.open(this._base);
    // this.xterm.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');

    // this.xterm.fit(); 
  }

  render() {
    return (
      <Window
        {...this.props}
        title="XTerm"
      >
        {
          // TODO: Remove hardcoded value
        }
        <iframe src="http://localhost:8080" style={{border: 0, width: 500, height: 400}}></iframe>
      </Window>
    );
  }
}