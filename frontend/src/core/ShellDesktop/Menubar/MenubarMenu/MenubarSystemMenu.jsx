import React from 'react';
import MenubarMenu from './MenubarMenu';
import { Icon } from 'antd';

export default class MenubarSystemMenu extends MenubarMenu {
  constructor() {
    super();
    
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
        }
      ]
    });

    console.warn('constructed system menu', this);
  }
}