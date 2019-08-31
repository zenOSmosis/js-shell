// TODO: Emit update event when AppRuntimeMenubar data has been changed

import EventEmitter from 'events';
import './AppRuntimeMenubarMenu.typedef';

/**
 * TODO: Document event object
 * 
 * @event {Object} EVT_UPDATE Emits with updated menuData
 */
export const EVT_UPDATE = 'update';

export default class AppRuntimeMenubarMenu extends EventEmitter {
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

  getAppRuntimeMenubar() {
    return this._menubar;
  }

  getAppRuntime() {
    const menubar = this.getAppRuntimeMenubar();

    return menubar.getAppRuntime();
  }

  getMenuData() {
    return this._menuData;
  }
}
