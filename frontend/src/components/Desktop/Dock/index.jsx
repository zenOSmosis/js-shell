// import Desktop from '../Desktop';
import React, { Component } from 'react';
import ViewTransition from 'components/ViewTransition';
import Image from 'components/Image';
import AppConfigLinkedState from 'state/AppConfigLinkedState';
import { Tooltip } from 'antd';
import './style.css';

export default class Dock extends Component {
  state = {
    appConfigs: []
  };

  _desktop = null;
  _appConfigLinkedState = null;

  constructor() {
    super();

    this._appConfigLinkedState = new AppConfigLinkedState();
  }

  componentDidMount() {
    const { desktop } = this.props;

    /*
    if (!(desktop instanceof Desktop)) {
      throw new Error('desktop must be an instance of Desktop');
    }
    */

    this._desktop = desktop;

    // TODO: Refactor
    (() => {
      const appConfigs = this._appConfigLinkedState.getAppConfigs();

      console.debug('current run configs', appConfigs);

      this.setState({
        appConfigs
      });

      /*
      appConfigs.forEach(appConfig => {
        desktop.createWindow(appConfig._desktopWindows[0]);
      });
      */
    })();
  }

  handleDockItemClick(appConfig) {
    const isRunning = appConfig.getIsRunning();

    if (!isRunning) {
      appConfig.launch();
    } else {
      // TODO: If app is already launched, bring it to the front
      console.warn('TODO: Implement bring to front');
    }
  }

  render() {
    const { className, desktop, ...propsRest } = this.props;
    const { appConfigs } = this.state;

    return (
      <div
        {...propsRest}
        className={`zd-desktop-dock ${className ? className : ''}`}
      >
        {
          // TODO: Convert items to a UL
        }

        <div className="zd-desktop-dock-items">
          {
            appConfigs.map((appConfig, idx) => {
              const iconSrc = appConfig.getIconSrc();
              const title = appConfig.getTitle();
              // const mainWindow = appConfig.getMainWindow();

              // TODO: Also check if the app should ride in the Dock
              if (!iconSrc) {
                return null;
              }

              // TODO: Convert to DockItem (or equiv.) class
              return (
                <ViewTransition
                  key={idx}
                  effect="wobble" // TODO: Use variable
                  style={{/*borderBottom: '5px blue solid',*/ margin: '0px 5px' }}
                >
                  <Tooltip title={title}>
                    <button
                      onClick={ evt => this.handleDockItemClick(appConfig) }
                    >
                      <Image src={iconSrc} height="40px" style={{ padding: '0px 2px' }} />
                    </button>
                  </Tooltip>
                </ViewTransition>
              );
            })
          }
        </div>
      </div>
    );
  }
}