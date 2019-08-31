// TODO: Incorporate ability to dynamically edit menus / update EventEmitter
// as necessary

import { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import EventEmitter from 'events';
import {
  AppRuntimeMenubarSystemMenu,
  AppRuntimeMenubarAppMenu,
  AppRuntimeMenubarAuxMenu,
  AppRuntimeMenubarWindowMenu
} from './menus';

export const EVT_UPDATE = 'update';

/**
 * The AppRuntimeMenubar populates the top of the Shell UI with menu data related to
 * the attached process.
 */
export default class AppRuntimeMenubar extends EventEmitter {
  /**
   * @param {AppRuntime} appRuntime
   * @param {Object[]} auxMenusData
   */
  constructor(appRuntime, auxMenusData = []) {
    super();

    this._appRuntime = appRuntime;

    // Core menus
    this._systemMenu = new AppRuntimeMenubarSystemMenu(this);
    this._appMenu = new AppRuntimeMenubarAppMenu(this);
    this._windowMenu = new AppRuntimeMenubarWindowMenu(this);

    // Clean up core menus before exit
    this._appRuntime.once(EVT_BEFORE_EXIT, () => {
      this._systemMenu.removeAllListeners();
      this._systemMenu = null;

      this._appMenu.removeAllListeners();
      this._appMenu = null;

      this._windowMenu.removeAllListeners();
      this._windowMenu = null;
    });
    
    this._auxMenus = [];
    this._auxMenusData = auxMenusData;

    this.setAuxMenusData(auxMenusData);
  }

  /**
   * Sets data for all auxiliary menus.
   */
  setAuxMenusData(auxMenusData) {
    this._auxMenusData = auxMenusData;

    // Destroy existing aux menus
    this._auxMenus.forEach(auxMenu => {
      auxMenu.removeAllListeners();
    });
    this._auxMenus = [];

    // Create / Re-create aux menus
    this._auxMenus = auxMenusData.map((auxMenuData) => {
      let auxMenu = new AppRuntimeMenubarAuxMenu(this, auxMenuData);

      // Clean up before exit
      this._appRuntime.once(EVT_BEFORE_EXIT, () => {
        auxMenu.removeAllListeners();
        auxMenu = null;
      });

      return auxMenu;
    });

    this.emit(EVT_UPDATE);
  }

  /**
   * Retrieves data for all auxiliary menus.
   */
  getAuxMenusData() {
    return this._auxMenusData;
  }

  /**
   * @return {AppRuntimeMenubarMenu[]}
   */
  getMenus() {
    return [
      this._systemMenu,
      this._appMenu,
      ...this._auxMenus,
      this._windowMenu
    ];
  }
  
  /**
   * Retrieves the connected AppRuntime.
   * 
   * @return {AppRuntime}
   */
  getAppRuntime() {
    return this._appRuntime;
  }
}