import React, {Component} from 'react';
import {Grid, GridItem} from '../Grid';
import socket from './../../utils/socket.io';
import sysCommand from './../../utils/sysCommand';

const Image = (props = {}) => {
  return (
    <img
      src={props.src}
      {...props}
    />
  );
};

const parseURL = (url) => {
  const parser = document.createElement('a');
  parser.href = url;

  /*
  parser.protocol; // => "http:"
  parser.hostname; // => "example.com"
  parser.port;     // => "3000"
  parser.pathname; // => "/pathname/"
  parser.search;   // => "?search=test"
  parser.hash;     // => "#hash"
  parser.host;     // => "example.com:3000"
  */

  return parser;
};

export default class AppMenu extends Component {
  state = {
    apps: []
  };

  fetchAppList() {
    socket.emit('fetch-apps', {}, (data) => {
      console.debug(data);

      this.setState({
        apps: data
      });
    });
  }

  render () {
    const parsedWinURL = parseURL(window.href);
    // TODO: Move hardcoded value
    const API_PORT = 3001;

    // TODO: Implement pagination

    return (
      <div>
        AppMenu

        <Grid style={{overflow: 'auto', textAlign: 'center'}}>
          {
            this.state.apps.map((app, idx) => {
              return (
                <GridItem
                  key={idx}
                  style={{width: '120px', height: '120px', border: '1px #ccc solid', overflow: 'hidden', margin: '4px'}}
                >
                  <button
                    key={idx}
                    style={{overflow: 'hidden', position: 'relative', backgroundColor: 'transparent', display: 'inline-block', margin: '0px', padding: '0px', color: '#fff', fontSize: '.8rem', width: '100%', height: '100%', border: 'transparent'}}
                    title={app.description}
                    onClick={ (evt) => console.log(app) }
                    onDoubleClick={ (evt) => sysCommand(app.spawn.command, app.spawn.args) }
                  >
                    <Image
                      src={`${parsedWinURL.protocol}//${parsedWinURL.hostname}:${API_PORT}/files?filePath=${app.iconPath}`}
                      width="100%"
                      height="100%"
                      style={{width: '100%', height: '100%', position: 'absolute', top: '0px', left: '0px'}}
                    />

                    <div style={{width: '100%', textAlign: 'center', position: 'absolute', bottom: '0px', color: '#fff', fontWeight: 'bold', textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'}}>
                      {app.meta.Name}
                    </div>
                  </button>
                </GridItem>
              );
            })
          }
        </Grid>

        <button onClick={ (evt) => this.fetchAppList() }>Fetch</button>
      </div>
    );
  }
}