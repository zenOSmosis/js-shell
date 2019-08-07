import React from 'react';
import MenubarMenu from '../MenubarMenu';

export default class MenubarAppMenu extends MenubarMenu {
  constructor(...args) {
    super(...args);
    
    this._createOrUpdateMenu();

    const guiProcess = this.getGUIProcess();

    // TODO: Use EVT_TICK constant
    guiProcess.on('tick', () => {
      this._createOrUpdateMenu();
    });
  }

  _createOrUpdateMenu() {
    const guiProcess = this.getGUIProcess();

    const menu = {
      title: <span style={{ fontWeight: 'bold' }}>{guiProcess.getTitle()}</span>,
      items: [
        {
          title: 'Close',
          onClick: () => {
            guiProcess.close();
          }
        }
      ]
    };

    menu.items = (guiProcess.menuItems || []).concat(menu.items)

    this.setData(menu);
  }
}