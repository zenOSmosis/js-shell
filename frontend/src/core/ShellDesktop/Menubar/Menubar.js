// TODO: Incorporate ability to dynamically edit menus / update EventEmitter
// as necessary

import EventEmitter from 'events';
import {
  MenubarSystemMenu,
  MenubarAppMenu,
  MenubarEditMenu,
  MenubarWindowMenu
} from './MenubarMenu';

export default class Menubar extends EventEmitter {
  constructor() {
    super();

    this._menus = this._createMenus();
  }

  _createMenus() {
    const menus = [
      new MenubarSystemMenu(),
      new MenubarAppMenu(),
      // new MenubarEditMenu(),
      new MenubarWindowMenu()
    ];

    return menus;
  }

  getMenus() {
    return this._menus;
  }
}