// TODO: Replace internal hardcoded values

import React, {Component} from 'react';
import {Grid, GridItem} from '../Grid';
import Icon from '../Icon';
import socket from 'utils/socket.io';
import parseURL from 'utils/parseURL';

export default class AppMenu extends Component {
  state = {
    apps: [],
    appCategories: []
  };

  componentDidMount() {
    this.fetchAppCategories();
  }

  /**
   * Freedesktop categories:
   * @see https://standards.freedesktop.org/menu-spec/latest/apa.html
   */
  fetchAppCategories() {
    socket.emit('fetch-app-categories', {}, (appCategories) => {
      console.debug('app categories:', appCategories);

      this.setState({
        appCategories
      });
    });
  }

  fetchAppList() {
    socket.emit('fetch-apps', {}, (apps) => {
      console.debug('apps:', apps);

      this.setState({
        apps
      });
    });
  }

  selectApp(app) {
    if (typeof this.props.onAppSelect === 'function') {
      this.props.onAppSelect(app);
    }

    // Automatically close panel after selecting app
    this.close();
  }

  close() {
    this._fullViewportPanel.close();
  }

  render () {
    const parsedWinURL = parseURL(window.href);
    // TODO: Move hardcoded value
    const API_PORT = 3001;

    // TODO: Implement pagination

    return (
      <div
        ref={ c => this._fullViewportPanel = c }
        {...this.props}
        title="Application Menu"
        description="Locate installed applications"
      >
        <div style={{textAlign: 'center'}}>
          <input type="text" placeholder="Search for an application" />
          &nbsp;|&nbsp;
          <button onClick={ (evt) => this.fetchAppList() }>All Apps</button>
        </div>

        <hr />

        <div style={{textAlign: 'center'}}>
          <h2>Select by category</h2>
          
          <Grid style={{overflow: 'auto', textAlign: 'center'}}>
            {
              this.state.appCategories.map((appCategory, idx) => {
                let {name, niceName, description, iconPath} = appCategory;
                niceName = niceName || name;

                return (
                  <GridItem
                    key={idx}
                    style={{width: '100px', height: '100px', overflow: 'hidden', margin: '7px'}}
                  >
                    <Icon
                      name={niceName}
                      description={description}
                      // src="http://localhost:3001/files?filePath=/usr/share/icons/Humanity/apps/16/preferences-desktop-theme.svg"
                      src={`${parsedWinURL.protocol}//${parsedWinURL.hostname}:${API_PORT}/icons?iconName=${iconPath}`}
                      style={{backgroundColor: '#fff'}}
                      // onClick={ (evt) => this.selectApp(app) }
                    />
                  </GridItem>
                );
              })
            }
          </Grid>
        </div>

        <Grid style={{overflow: 'auto', textAlign: 'center'}}>
          {
            this.state.apps.map((app, idx) => {
              return (
                <GridItem
                  key={idx}
                  style={{width: '100px', height: '100px', overflow: 'hidden', margin: '7px'}}
                >
                  <Icon
                    name={app.name}
                    description={app.description}
                    src={`${parsedWinURL.protocol}//${parsedWinURL.hostname}:${API_PORT}/files?filePath=${app.iconPath}`}
                    onClick={ (evt) => this.selectApp(app) }
                  />
                </GridItem>
              );
            })
          }
        </Grid>
      </div>
    );
  }
}