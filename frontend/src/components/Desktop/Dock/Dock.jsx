// TODO: Highlight opened apps

// TODO: Add badge capability to Dock icons
// https://ant.design/components/badge/#header

import React, { Component } from 'react';

import hocConnect from 'state/hocConnect';
import AppRegistryLinkedState from 'state/AppRegistryLinkedState';
// import DesktopLinkedState from 'state/DesktopLinkedState';
import DockItem from './DockItem';
import classNames from 'classnames';
import styles from './Dock.module.scss';

/**
 * The items in the Dock represent a filtered subset of AppRegistration
 * instances.
 * 
 * @extends React.Component
 */
class Dock extends Component {

  render() {
    // TODO: Rename to appRegistrations
    const {
      className,
      appRegistrations: propsAppRegistrations,
      ...propsRest
    } = this.props;

    const appRegistrations = propsAppRegistrations || [];

    return (
      <div
        {...propsRest}
        className={classNames(styles['dock'], className)}
      >
        {
          // TODO: Convert items to a UL
        }

        <div className={styles['dock-items']}>
          {
            appRegistrations.map((appRegistration, idx) => {
              const iconView = appRegistration.getIconView();

              // TODO: Also check if the appRegistration should ride in the Dock
              if (!iconView) {
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