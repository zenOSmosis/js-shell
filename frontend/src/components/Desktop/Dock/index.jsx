import React, { Component } from 'react';
import Image from 'components/Image';
import { Tooltip } from 'antd';
import hocConnect from 'state/hocConnect';
import AppLinkedState from 'state/AppLinkedState';
// import DesktopLinkedState from 'state/DesktopLinkedState';
import './style.css';

class Dock extends Component {
  handleDockItemClick(app) {
    const isRunning = app.getIsRunning();

    if (!isRunning) {
      app.launch();
    } else {
      // TODO: If app is already launched, bring it to the front
      console.warn('TODO: Implement bring to front');
    }
  }

  render() {
    const { className, apps: propsApps, ...propsRest } = this.props;

    const apps = propsApps || [];

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
            apps.map((app, idx) => {
              const iconSrc = app.getIconSrc();
              const title = app.getTitle();
              // const mainWindow = app.getMainWindow();

              // TODO: Also check if the app should ride in the Dock
              if (!iconSrc) {
                return null;
              }

              // TODO: Convert to DockItem (or equiv.) class
              return (
                <div
                  key={idx}
                  // effect="wobble" // TODO: Use variable
                  style={{/*borderBottom: '5px blue solid',*/ margin: '0px 5px', display: 'inline-block' }}
                >
                  <Tooltip title={title}>
                    <button
                      onClick={ evt => this.handleDockItemClick(app) }
                    >
                      <Image src={iconSrc} height="40px" style={{ padding: '0px 2px' }} />
                    </button>
                  </Tooltip>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default /*const appLinkeStateConnectedDock =*/ hocConnect(Dock, AppLinkedState, (updatedState) => {
  const {apps} = updatedState;

  if (apps) {
    return {
      apps
    };
  }
});

/*
export default hocConnect(appLinkeStateConnectedDock, DesktopLinkedState, (updatedState) => {
  console.warn('TODO: Handle Dock DesktopLinkedState binding', updatedState);
});
*/