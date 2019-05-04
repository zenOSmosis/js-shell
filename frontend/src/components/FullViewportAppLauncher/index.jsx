import React, {Component} from 'react';
import FullViewportPanel from '..//FullViewportPanel';
// import FullViewportAppMenu from '../FullViewportAppMenu';
import GPUSelector from '../GPUSelector';
import {Grid, GridItem} from '../Grid';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
// import AMDLogo from '../../icons/brands/AMD-logo.svg';
// import IntelLogo from '../../icons/brands/Intel-logo.svg';
// import NvidiaLogo from '../../icons/brands/Nvidia-logo.svg';
// import RocketStartUp from '../../icons/rocket-start-up/rocket-start-up.svg';
import systemCommand from 'utils/systemCommand';

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

export default class FullViewportAppLauncher extends Component {
  state = {
    selectedApp: null,
    appSelectorOpenCode: -1
  };

  onAppSelect = (app) => {
    this.setState({
      selectedApp: app
    }, () => {
      console.debug('Selected app:', app);
    });
  }

  launchApp = (app = null) => {
    if (!app) {
      app = this.state.selectedApp;
    }

    systemCommand(app.spawn.command, app.spawn.args);
  }

  openAppSelector() {
    alert('TODO: Reimplement open app selector');
  }

  render () {
    const parsedWinURL = parseURL(window.href);
    // TODO: Move hardcoded value
    const API_PORT = 3001;

    let {name: selectedAppName} = this.state.selectedApp || {};
    selectedAppName = selectedAppName || 'Select an app...';

    return (
      <FullViewportPanel
        isOpen={true}
        title="Application Launcher"
        description="Choose options for launching this application"
      >
        <div style={{float: 'right'}}>
          <button onClick={ evt => this.launchApp() }>
            {
              // <img src={RocketStartUp} width="80px" />
            }
          </button>
        </div>

        <div>
          <span className="label">Application:</span>
          <ButtonDropdown
              onClick={ evt => this.openAppSelector() } isOpen={false}
              toggle={ evt => null }
          >
            <DropdownToggle caret>
              {selectedAppName}
            </DropdownToggle>
          </ButtonDropdown>

          {
            /*
            <FullViewportAppMenu
              // isOpen={this.state.isAppSelectorOpen}
              openCode={this.state.appSelectorOpenCode}
              onAppSelect={this.onAppSelect}
            />
            */
          }
          
        </div>

        <div>
          <span className="label">&mdash; GPU:</span>
          <GPUSelector />
        </div>

        <hr />

        <div>
          <span className="label">Launch Configuration:</span>
          {
            // TODO: Automate launch configuration
          }
          <Grid style={{width: '100%', height: '300px'}}>
            {
              this.state.selectedApp &&
              <GridItem style={{backgroundColor: 'rgba(255,255,255,.1)', border: '1px #ccc solid', width: '200px', height: '200px', overflow: 'hidden', margin: 4}}>
                {
                  // TODO: Use Image element here
                }
                <img
                  alt={this.state.selectedApp.name}
                  title={this.state.selectedApp.name}
                  src={`${parsedWinURL.protocol}//${parsedWinURL.hostname}:${API_PORT}/files?filePath=${this.state.selectedApp.iconPath}`}
                  style={{width: '100%'}}
                />
              </GridItem>
            }
            <GridItem style={{backgroundColor: 'rgba(255,255,255,.1)', border: '1px #ccc solid', width: '200px', height: '200px',  overflow: 'hidden', margin: 4}}>
              {
                // TODO: Remove hardcoded value
              }
              {
                // <img alt="AMD" src={AMDLogo} style={{width: '100%'}} />
              }
              
            </GridItem>
          </Grid>
        </div>  
      </FullViewportPanel>
    );
  }
}