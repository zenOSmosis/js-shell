// TODO: Incorporate ability to dynamically edit menus / update EventEmitter
// as necessary

import EventEmitter from 'events';
import { MenubarSystemMenu, MenubarAppMenu, MenubarWindowMenu } from './menus';

/*
import {
  MenubarSystemMenu,
  MenubarAppMenu,
  MenubarWindowMenu
} from 'core/ShellDesktop/Menubar/MenubarMenu';
*/

export const EVT_UPDATE = 'update';

/**
 * The Menubar populates the top of the Shell UI with menu data related to
 * the attached process.
 */
export default class Menubar extends EventEmitter {
  /**
   * @param {ClientGUIProcess} guiProcess
   */
  constructor(guiProcess) {
    super();

    this._guiProcess = guiProcess;

    this._menus = [
      new MenubarSystemMenu(this),
      new MenubarAppMenu(this),
      new MenubarWindowMenu(this)
    ];

    // this._menus = this._createMenus();
  }

  /**
   * @param {ClientGUIProcessMenubarMenu[]} menus 
   */
  setMenus(menus) {
    this._menus = menus;

    this.emit(EVT_UPDATE, this._menus);
  }

  /**
   * @return {ClientGUIProcessMenubarMenu[]}
   */
  getMenus() {
    return this._menus;
  }

  /*
  _createMenus() {
    /*
    const menus = [
      new MenubarSystemMenu(this),
      new MenubarAppMenu(this),
      // new MenubarEditMenu(this),
      new MenubarWindowMenu(this)
    ];

    return menus;
  }
  */
  
  /**
   * Retrieves the connected ClientGUIProcess.
   * 
   * @return {ClientGUIProcess}
   */
  getGUIProcess() {
    return this._guiProcess;
  }
}