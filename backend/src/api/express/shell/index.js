const pty = require('node-pty');

module.exports = expressShell;

function expressShell(app2) {
  /*this._expressWs = require('express-ws')(app);

  // Instantiate shell and set up data handlers
  this._expressWs.app.ws('/shell', (ws, req) => {
    console.log('------ shell connect')
    // Spawn the shell
    const shell = pty.spawn('/bin/bash', [], {
      name: 'xterm-color',
      cwd: process.env.PWD,
      env: process.env
    });
    // For all shell data send it to the websocket
    shell.on('data', (data) => {
      ws.send(data);
    });
    // For all websocket data send it to the shell
    ws.on('message', (msg) => {
      shell.write(msg);
    });
  });*/
  const express = require('express');
 

  const app = express();
  const expressWs = require('express-ws')(app);

  // Serve static assets from ./static
  app.use(express.static(`${__dirname}/static`));

  // Instantiate shell and set up data handlers
  expressWs.app.ws('/shell', (ws, req) => {
    // Spawn the shell
    const shell = pty.spawn('/bin/bash', [], {
      name: 'xterm-color',
      cwd: process.env.PWD,
      env: process.env
    });
    // For all shell data send it to the websocket
    shell.on('data', (data) => {
      ws.send(data);
    });
    // For all websocket data send it to the shell
    ws.on('message', (msg) => {
      shell.write(msg);
    });
  });

  // Start the application
  app.listen(3002);
}








