import React, {Component} from 'react';
import socket from './../../utils/socket.io';
import sysCommand from './../../utils/sysCommand';

export default class AppMenu extends Component {
  state = {
    apps: []
  };

  fetchAppList() {
    socket.emit('request-app-list', {}, (data) => {
      console.debug(data);

      this.setState({
        apps: data
      });
    });
  }

  render () {
    return (
      <div>
        AppMenu

        <div style={{overflow: 'auto', textAlign: 'center'}}>
          {
            this.state.apps.map((app, idx) => {
              return (
                <button
                  key={idx}
                  title={app.description}
                  style={{overflow: 'hidden', backgroundColor: 'transparent', display: 'inline-block', margin: '10px', color: '#fff', border: '1px #ccc solid', fontSize: '.8rem', width: '120px', height: '120px'}}
                  onClick={ (evt) => console.log(app) }
                  onDoubleClick={ (evt) => sysCommand(app.spawn.command, app.spawn.args) }
                >
                  {app.meta.Name}
                </button>
              );
            })
          }
        </div>

        <button onClick={ (evt) => this.fetchAppList() }>Fetch</button>
      </div>
    );
  }
}