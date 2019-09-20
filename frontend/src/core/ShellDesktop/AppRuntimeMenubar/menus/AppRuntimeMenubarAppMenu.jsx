import React from 'react';
import { EVT_TICK } from 'process/ClientProcess';
import AppRuntimeMenubarMenu from '../AppRuntimeMenubarMenu';

export default class AppRuntimeMenubarAppMenu extends AppRuntimeMenubarMenu {
  constructor(...args) {
    super(...args);
    
    this._createOrUpdateMenu();

    const appRuntime = this.getAppRuntime();

    // Update menu on each process tick
    appRuntime.on(EVT_TICK, () => {
      this._createOrUpdateMenu();
    });
  }

  _createOrUpdateMenu() {
    const appRuntime = this.getAppRuntime();

    const menu = {
      title: <span style={{ fontWeight: 'bold' }}>{appRuntime.getTitle()}</span>,
      items: [
        {
          title: 'Close',
          onClick: () => {
            appRuntime.close();
          }
        }
      ]
    };

    menu.items = (appRuntime.menuItems || []).concat(menu.items);

    this.setData(menu);
  }
}