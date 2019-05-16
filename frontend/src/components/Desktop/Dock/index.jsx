import React, { Component } from 'react';
import ViewTransition from 'components/ViewTransition';
import Image from 'components/Image';
import { Tooltip } from 'antd';
import hocConnect from 'state/hocConnect';
import AppConfigLinkedState from 'state/AppConfigLinkedState';
// import DesktopLinkedState from 'state/DesktopLinkedState';
import './style.css';

class Dock extends Component {
  _appConfigLinkedState = null;

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
    const { className, appConfigs: propsAppConfigs, ...propsRest } = this.props;

    const appConfigs = propsAppConfigs || [];

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

export default hocConnect(Dock, AppConfigLinkedState, (updatedState) => {
  const {appConfigs} = updatedState;

  if (appConfigs) {
    return {
      appConfigs
    };
  }
});