// TODO: Highlight opened apps

// TODO: Add badge capability to Dock icons
// https://ant.design/components/badge/#header

import React, { Component } from 'react';

import hocConnect from 'state/hocConnect';
import AppRegistryLinkedState from 'state/AppRegistryLinkedState';
// import DesktopLinkedState from 'state/DesktopLinkedState';
import DockItem from './DockItem';
import './style.css';

/**
 * The items in the Dock represent a filtered subset of AppRegistration
 * instances.
 * 
 * @extends React.Component
 */
class Dock extends Component {

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

              // TODO: Also check if the appRegistration should ride in the Dock
              if (!iconSrc) {
                return null;
              }

              return (
                <DockItem
                  appRegistration={appRegistration}
                  key={idx}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}

const AppRegistryDock = hocConnect(Dock, AppRegistryLinkedState, (updatedState, linkedScope) => {
  const appRegistrations = linkedScope.getAppRegistrations();

  return {
    appRegistrations
  };
});

export default AppRegistryDock;