// TODO: Emit update event when Menubar data has been changed

import EventEmitter from 'events';
import './MenubarMenu.typedef';

export default class MenubarMenu extends EventEmitter {
  constructor(menuData) {
    super();
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

    console.warn('set menudata', this._menuData);

  }

  getMenuData() {
    return this._menuData;
  }
}
