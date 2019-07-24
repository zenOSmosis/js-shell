// TODO: Emit update event when Menubar data has been changed

import EventEmitter from 'events';
import './MenubarMenu.typedef';

/**
 * TODO: Document event object
 * 
 * @event {Object} EVT_UPDATE Emits with updated menuData
 */
export const EVT_UPDATE = 'update';

export default class MenubarMenu extends EventEmitter {
  constructor(menubar) {
    super();

    this._menubar = menubar;
  }

  setData(menuData) {
    if (!menuData) {
      throw new Error('menuData not passed as argument');
    }

    const {
      title,
      items
    } = menuData;

    this._menuData = {
      title,
      items: items || []
    };

    // Emit update event w/ menuData
    this.emit(EVT_UPDATE, this._menuData);
  }

  getMenubar() {
    return this._menubar;
  }

  getGUIProcess() {
    const menubar = this.getMenubar();

    return menubar.getGUIProcess();
  }

  getMenuData() {
    return this._menuData;
  }
}
