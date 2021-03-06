// TODO: Incorporate ability to dynamically edit menus / update EventEmitter
// as necessary

import { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import { EVT_UPDATE as EVT_MENU_UPDATE } from './AppRuntimeMenubarMenu';
import EventEmitter from 'events';
import {
  AppRuntimeMenubarSystemMenu,
  AppRuntimeMenubarAppMenu,
  AppRuntimeMenubarAuxMenu,
  AppRuntimeMenubarWindowMenu,
  AppRuntimeMenubarHelpMenu
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
    this._systemMenu = this._initCoreMenuClass(AppRuntimeMenubarSystemMenu);
    this._appMenu = this._initCoreMenuClass(AppRuntimeMenubarAppMenu);
    this._windowMenu = this._initCoreMenuClass(AppRuntimeMenubarWindowMenu);
    this._helpMenu = this._initCoreMenuClass(AppRuntimeMenubarHelpMenu)
    
    this._auxMenus = [];
    this._auxMenusData = auxMenusData;

    this.setAuxMenusData(auxMenusData);
  }

  _initCoreMenuClass(AppRuntimeMenubarMenu) {
    let coreMenuInstance = new AppRuntimeMenubarMenu(this);

    coreMenuInstance.on(EVT_MENU_UPDATE, () => {
      this.emit(EVT_UPDATE);
    });

    this._appRuntime.once(EVT_BEFORE_EXIT, () => {
      coreMenuInstance.removeAllListeners();

      coreMenuInstance = null;
    });

    return coreMenuInstance;
  }

  /**
   * Sets data for all auxiliary menus.
   * 
   * Auxiliary menus are dynamic menus set by the AppRuntime.
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

    // Emit update event
    this.emit(EVT_UPDATE);
  }

  /**
   * Retrieves data for all auxiliary menus.
   */
  getAuxMenusData() {
    return this._auxMenusData;
  }

  /**
   * Retrieves all menus with a title.
   * 
   * @return {AppRuntimeMenubarMenu[]}
   */
  getMenus() {
    const menus = [
      this._systemMenu,
      this._appMenu,
      ...this._auxMenus,
      this._windowMenu,
      this._helpMenu
    ].filter(menu => {
      const { title } = menu.getMenuData();
      return (title ? true : false);
    });

    return menus;
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