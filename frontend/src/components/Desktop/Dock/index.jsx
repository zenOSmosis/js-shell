// TODO: Highlight opened apps

// TODO: Add badge capability to Dock icons
// https://ant.design/components/badge/#header

import React, { Component } from 'react';
import Image from 'components/Image';
import { Tooltip } from 'antd';
import hocConnect from 'state/hocConnect';
import AppRegistryLinkedState, { APP_REGISTRATIONS_LINKED_SCOPE_NAME } from 'state/AppRegistryLinkedState';
// import DesktopLinkedState from 'state/DesktopLinkedState';
import './style.css';

class Dock extends Component {
  handleDockItemClick(appRegistration) {
    const isLaunched = appRegistration.getIsLaunched();

    if (!isLaunched) {
      appRegistration.launchApp();
    } else {
      // TODO: If app is already launched, bring it to the front
      console.warn('TODO: Implement bring to front');
    }
  }

  render() {
    // TODO: Rename to appRegistrations
    const { className, appRegistrations: propsAppRegistrations, ...propsRest } = this.props;
    const appRegistrations = propsAppRegistrations || [];

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
            appRegistrations.map((appRegistration, idx) => {
              const iconSrc = appRegistration.getIconSrc();
              const title = appRegistration.getTitle();

              // TODO: Also check if the appRegistration should ride in the Dock
              if (!iconSrc) {
                return null;
              }

              // TODO: Convert to DockItem (or equiv.) class
              return (
                <div
                  key={idx}
                  // effect="wobble" // TODO: Use variable
                  className="zd-desktop-dock-item"
                >
                  <Tooltip title={title}>
                    <button
                      onClick={ evt => this.handleDockItemClick(appRegistration) }
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

export default /*const appLinkeStateConnectedDock =*/ hocConnect(Dock, AppRegistryLinkedState, (updatedState) => {
  const appRegistrations = updatedState[APP_REGISTRATIONS_LINKED_SCOPE_NAME];

  if (appRegistrations) {
    return {
      appRegistrations
    };
  }
});

/*
export default hocConnect(appLinkeStateConnectedDock, DesktopLinkedState, (updatedState) => {
  console.warn('TODO: Handle Dock DesktopLinkedState binding', updatedState);
});
*/