import React from 'react';
import AppRuntimeMenubarMenu from '../AppRuntimeMenubarMenu';
import DeploymentUnitIcon from 'components/componentIcons/DeploymentUnitIcon';
// import DesktopLinkedState from 'state/DesktopLinkedState';

// TODO: Move this into AppRuntimeMenubarSystemMenu lifecycle, once available (currently
// no destructor)
// const _desktopLinkedState = new DesktopLinkedState();

export default class AppRuntimeMenubarSystemMenu extends AppRuntimeMenubarMenu {
  constructor(...args) {
    super(...args);

    this.setData({
      title: <DeploymentUnitIcon />,
      items: [
        /**
         * @type {AppRuntimeMenubarMenuItem}
         */
        {
          title: 'System Information',
          subMenus: [
            {
              title: 'Client',
              onClick: () => {
                console.debug('Clicked client');
              }
            },
            {
              title: 'Server',
              onClick: () => {
                console.debug('Clicked server');
              }
            }
          ]
        },
        /**
         * @type {AppRuntimeMenubarMenuItem}
         */
        {
          title: 'Logout',
          onClick: () => {
            alert('TODO: Handle logout');
          }
        }
      ]
    });

    console.warn('constructed system menu', this);
  }
}