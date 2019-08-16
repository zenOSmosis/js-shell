import React from 'react';
import MenubarMenu from '../MenubarMenu';
import { Icon } from 'antd';
import DesktopLinkedState from 'state/DesktopLinkedState';

// TODO: Move this into MenubarSystemMenu lifecycle, once available (currently
// no destructor)
const _desktopLinkedState = new DesktopLinkedState();

export default class MenubarSystemMenu extends MenubarMenu {
  constructor(...args) {
    super(...args);

    this.setData({
      title: <Icon type="deployment-unit" />,
      items: [
        /**
         * @type {MenubarMenuItem}
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
         * @type {MenubarMenuItem}
         */
        {
          title: 'Dock Items',
          subMenus: [
            {
              title: 'Dock Item 1',
              onClick: () => {
                console.debug('TODO: Launch Dock Item 1');
              }
            },
            {
              title: 'Dock Item 2',
              onClick: () => {
                console.debug('TODO: Launch Dock Item 2');
              }
            }
          ]
        },
        /**
         * @type {MenubarMenuItem}
         */
        {
          title: 'Logout',
          onClick: () => {
            _desktopLinkedState.setIsLogged(false);
          }
        }
      ]
    });

    console.warn('constructed system menu', this);
  }
}